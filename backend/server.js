const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const QLOO_BASE_URL =
  process.env.QLOO_BASE_URL || "https://hackathon.api.qloo.com";

// ============================================
// 1. HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    project: "TasteMatch AI",
    qlooConfigured: Boolean(process.env.QLOO_API_KEY),
  });
});

// ============================================
// 2. QLOO API HELPER
// ============================================

async function fetchQloo(params) {
  if (!process.env.QLOO_API_KEY) {
    throw new Error("Qloo API key is missing.");
  }

  const url = new URL("/v2/insights", QLOO_BASE_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      "X-Api-Key": process.env.QLOO_API_KEY,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Qloo API error ${response.status}: ${JSON.stringify(data).slice(0, 700)}`
    );
  }

  return data.results?.entities || [];
}

// ============================================
// 3. RESTAURANT DISCOVERY
// ============================================

const RESTAURANT_TAG = "urn:tag:category:place:restaurant";

// Candidate cuisine tags.
// These must be verified against Qloo's supported tag IDs.
const CUISINE_TAGS = {
  Indian: "urn:tag:genre:restaurant:Indian",
  Italian: "urn:tag:genre:restaurant:Italian",
  Japanese: "urn:tag:genre:restaurant:Japanese",
  Mexican: "urn:tag:genre:restaurant:Mexican",
  Thai: "urn:tag:genre:restaurant:Thai",
  Chinese: "urn:tag:genre:restaurant:Chinese",
  American: "urn:tag:genre:restaurant:American",
  Mediterranean: "urn:tag:genre:restaurant:Mediterranean",
  Korean: "urn:tag:genre:restaurant:Korean",
};

async function getRestaurants(city, cuisine = "") {
  const params = {
    "filter.type": "urn:entity:place",
    "filter.location.query": city,
    "filter.tags": RESTAURANT_TAG,
    take: 20,
  };

  const cuisineTag = CUISINE_TAGS[cuisine];

  if (cuisineTag) {
    params["signal.interests.tags"] = cuisineTag;
  }

  return await fetchQloo(params);
}

// ============================================
// 4. RESTAURANT TEST ENDPOINT
// ============================================

app.get("/api/restaurants", async (req, res) => {
  try {
    const city = String(req.query.city || "New York").trim();

    const cuisine = String(req.query.cuisine || "").trim();

    const restaurants = await getRestaurants(city, cuisine);

    res.json({
      success: true,
      city,
      cuisine,
      count: restaurants.length,
      results: {
        entities: restaurants,
      },
    });
  } catch (error) {
    console.error("Restaurant error:", error.message);

    res.status(502).json({
      error: "Unable to fetch restaurants",
      details: error.message,
    });
  }
});

// ============================================
// 5. PERSON COMPATIBILITY SCORING
// ============================================

function calculatePersonScore(restaurant, person, rank) {
  const tags = (restaurant.tags || []).map((tag) =>
    String(tag.name || "").toLowerCase()
  );

  const properties = restaurant.properties || {};

  const primaryGenre = properties.primary_genre;

  const genre = String(
    typeof primaryGenre === "string"
      ? primaryGenre
      : primaryGenre?.name || ""
  ).toLowerCase();

  const cuisine = String(person.cuisine || "").toLowerCase();

  const vibe = String(person.vibe || "").toLowerCase();

  const cuisineMatch =
    tags.some((tag) => tag.includes(cuisine)) ||
    genre.includes(cuisine);

  const vibeMatch = tags.some((tag) => tag.includes(vibe));

  // Qloo ranking contributes to the score.
  const rankingScore = Math.max(0, 80 - rank * 2);

  const cuisineBonus = cuisineMatch ? 12 : 0;

  const vibeBonus = vibeMatch ? 8 : 0;

  return Math.min(
    100,
    rankingScore + cuisineBonus + vibeBonus
  );
}

// ============================================
// 6. FAIRMATCH ALGORITHM
// ============================================

function calculateFairMatch(scoreA, scoreB) {
  const lowerScore = Math.min(scoreA, scoreB);

  const averageScore = (scoreA + scoreB) / 2;

  // 75% fairness + 25% overall satisfaction.
  return Math.round(
    0.75 * lowerScore + 0.25 * averageScore
  );
}

// ============================================
// 7. MATCH EXPLANATION
// ============================================

function generateExplanation(
  restaurant,
  personA,
  personB,
  scoreA,
  scoreB,
  recommendedForBoth
) {
  const tags = (restaurant.tags || []).map((tag) =>
    String(tag.name || "").toLowerCase()
  );

  const matchedPreferences = [];

  for (const person of [personA, personB]) {
    const name = person.name || "One of you";

    const cuisine = String(person.cuisine || "").toLowerCase();

    const vibe = String(person.vibe || "").toLowerCase();

    if (cuisine && tags.some((tag) => tag.includes(cuisine))) {
      matchedPreferences.push(
        `${name}'s ${person.cuisine} cuisine preference`
      );
    }

    if (vibe && tags.some((tag) => tag.includes(vibe))) {
      matchedPreferences.push(
        `${name}'s ${person.vibe} atmosphere preference`
      );
    }
  }

  if (matchedPreferences.length > 0) {
    return `This restaurant matches ${matchedPreferences.join(
      " and "
    )}.`;
  }

  if (recommendedForBoth) {
    return "This restaurant appeared in both personalized Qloo recommendation lists.";
  }

  if (Math.abs(scoreA - scoreB) <= 10) {
    return "This restaurant has a relatively balanced FairMatch score for both people.";
  }

  return "This restaurant is a potential compromise based on Qloo recommendations and its available attributes.";
}

// ============================================
// 8. FORMAT RESTAURANT DATA
// ============================================

function formatRestaurant(
  restaurant,
  personA,
  personB,
  rankA,
  rankB
) {
  // If a restaurant is missing from one person's
  // recommendation list, use a conservative fallback rank.
  const scoreA = calculatePersonScore(
    restaurant,
    personA,
    rankA ?? 25
  );

  const scoreB = calculatePersonScore(
    restaurant,
    personB,
    rankB ?? 25
  );

  const fairScore = calculateFairMatch(scoreA, scoreB);

  const properties = restaurant.properties || {};

  const recommendedForBoth =
    rankA !== null && rankB !== null;

  const primaryGenre = properties.primary_genre;

  return {
    id: restaurant.entity_id,

    name: restaurant.name,

    address: properties.address || "",

    image:
      properties.image?.url ||
      properties.images?.[0]?.url ||
      null,

    description:
      properties.short_description ||
      properties.description ||
      "",

    cuisine:
      (typeof primaryGenre === "string"
        ? primaryGenre
        : primaryGenre?.name) || "Restaurant",

    tags: (restaurant.tags || [])
      .map((tag) => tag.name)
      .filter(Boolean)
      .slice(0, 8),

    scoreA,
    scoreB,
    fairScore,

    recommendedForBoth,

    explanation: generateExplanation(
      restaurant,
      personA,
      personB,
      scoreA,
      scoreB,
      recommendedForBoth
    ),
  };
}

// ============================================
// 9. MAIN FAIRMATCH ENDPOINT
// ============================================

app.post("/api/match", async (req, res) => {
  try {
    const { personA, personB, city } = req.body || {};

    if (
      !personA?.cuisine ||
      !personB?.cuisine ||
      typeof city !== "string" ||
      !city.trim()
    ) {
      return res.status(400).json({
        error: "Please provide both taste profiles and a city.",
      });
    }

    // Fetch personalized recommendations separately.
    const [restaurantsA, restaurantsB] = await Promise.all([
      getRestaurants(city.trim(), personA.cuisine),
      getRestaurants(city.trim(), personB.cuisine),
    ]);

    // Combine both lists without duplicate restaurants.
    const combined = new Map();

    restaurantsA.forEach((restaurant, index) => {
      if (!restaurant.entity_id) return;

      combined.set(restaurant.entity_id, {
        restaurant,
        rankA: index,
        rankB: null,
      });
    });

    restaurantsB.forEach((restaurant, index) => {
      if (!restaurant.entity_id) return;

      const existing = combined.get(restaurant.entity_id);

      if (existing) {
        existing.rankB = index;
      } else {
        combined.set(restaurant.entity_id, {
          restaurant,
          rankA: null,
          rankB: index,
        });
      }
    });

    // Score and rank all unique restaurants.
    const recommendations = [...combined.values()]
      .map(({ restaurant, rankA, rankB }) =>
        formatRestaurant(
          restaurant,
          personA,
          personB,
          rankA,
          rankB
        )
      )
      .sort((a, b) => b.fairScore - a.fairScore)
      .slice(0, 8);

    res.json({
      success: true,

      project: "TasteMatch AI",

      city: city.trim(),

      totalCandidates: combined.size,

      personA: {
        name: personA.name || "Person A",
        cuisine: personA.cuisine,
        vibe: personA.vibe,
      },

      personB: {
        name: personB.name || "Person B",
        cuisine: personB.cuisine,
        vibe: personB.vibe,
      },

      recommendations,

      scoringNote:
        "FairMatch scores are TasteMatch estimates based on Qloo rankings and restaurant attributes, not official Qloo compatibility percentages.",
    });
  } catch (error) {
    console.error("FairMatch error:", error.message);

    res.status(502).json({
      error: "Unable to generate matches",
      details: error.message,
    });
  }
});

// ============================================
// 10. START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`TasteMatch AI backend running on port ${PORT}`);
});