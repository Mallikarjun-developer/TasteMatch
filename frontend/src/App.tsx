import { useMemo, useState } from "react";
import {
  Heart,
  MapPin,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  Users,
  Music,
  Clapperboard,
  Star,
  Compass,
  CheckCircle2,
  CalendarDays,
  Clock3,
  X,
  Copy,
  Share2,
  Download,
  RefreshCw,
  Bookmark,
} from "lucide-react";

import "./App.css";

// ============================================
// TYPES
// ============================================

type Person = {
  name: string;
  cuisine: string;
  vibe: string;
  music: string;
  movie: string;
};

type Recommendation = {
  id: string;
  name: string;
  address: string | Record<string, unknown>;
  image: string | null;
  description: string;
  cuisine: string;
  tags: string[];
  scoreA: number;
  scoreB: number;
  fairScore: number;
  explanation: string;
};

type MatchMode = "balanced" | "personA" | "personB";

type AdventureStep = {
  time: string;
  title: string;
  description: string;
};

type PreferenceKey = "cuisine" | "vibe" | "music" | "movie";

// ============================================
// CONSTANTS
// ============================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

const CUISINES = [
  "Indian",
  "Italian",
  "Japanese",
  "Mexican",
  "Thai",
  "Chinese",
  "American",
  "Mediterranean",
  "Korean",
];

const VIBES = [
  "Cozy",
  "Lively",
  "Romantic",
  "Elegant",
  "Casual",
  "Trendy",
  "Quiet",
];

const DIMENSIONS: {
  key: PreferenceKey;
  label: string;
}[] = [
  { key: "cuisine", label: "Food" },
  { key: "vibe", label: "Atmosphere" },
  { key: "music", label: "Music" },
  { key: "movie", label: "Movies" },
];

const DEFAULT_A: Person = {
  name: "",
  cuisine: "Indian",
  vibe: "Cozy",
  music: "",
  movie: "",
};

const DEFAULT_B: Person = {
  name: "",
  cuisine: "Italian",
  vibe: "Lively",
  music: "",
  movie: "",
};

const FAVORITES_KEY = "tastematch-favorites-v1";

// ============================================
// HELPERS
// ============================================

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getName(person: Person, fallback: string) {
  return person.name.trim() || fallback;
}

function getAddress(
  address: Recommendation["address"]
): string {
  if (typeof address === "string") {
    return address;
  }

  if (!address || typeof address !== "object") {
    return "";
  }

  return [
    address.street,
    address.city,
    address.region,
    address.country,
  ]
    .filter(
      (value): value is string =>
        typeof value === "string" && value.length > 0
    )
    .join(", ");
}

function getComparison(a: Person, b: Person) {
  const compared = DIMENSIONS.filter(
    ({ key }) => normalize(a[key]) && normalize(b[key])
  );

  return {
    shared: compared.filter(
      ({ key }) => normalize(a[key]) === normalize(b[key])
    ),

    different: compared.filter(
      ({ key }) => normalize(a[key]) !== normalize(b[key])
    ),

    count: compared.length,
  };
}

function loadFavorites(): Recommendation[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is Recommendation =>
            item !== null &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.name === "string"
        )
      : [];
  } catch {
    return [];
  }
}

// ============================================
// ADVENTURE PLANNER
// ============================================

function buildAdventure(
  restaurant: Recommendation,
  personA: Person,
  personB: Person,
  variation: number
): AdventureStep[] {
  const musicA = personA.music.trim();
  const musicB = personB.music.trim();

  const movieA = personA.movie.trim();
  const movieB = personB.movie.trim();

  const musicActivity =
    musicA && musicB
      ? normalize(musicA) === normalize(musicB)
        ? `Explore ${musicA} together or create a shared playlist.`
        : `Create a playlist mixing ${musicA} and ${musicB}. Take turns choosing songs.`
      : "Discover new music together and create a shared playlist.";

  const movieActivity =
    movieA && movieB
      ? `Talk about your favorite moments from ${movieA} and ${movieB}.`
      : "Share your favorite movie recommendations.";

  const variations: AdventureStep[][] = [
    [
      {
        time: "5:30 PM",
        title: "Explore the neighborhood",
        description:
          "Meet near the restaurant and enjoy a relaxed walk together.",
      },
      {
        time: "6:30 PM",
        title: `Dinner at ${restaurant.name}`,
        description:
          "Enjoy your selected restaurant and discover something new.",
      },
      {
        time: "8:00 PM",
        title: "Music discovery",
        description: musicActivity,
      },
      {
        time: "9:00 PM",
        title: "Dessert and movie talk",
        description: movieActivity,
      },
    ],

    [
      {
        time: "5:00 PM",
        title: "Start with a cultural adventure",
        description:
          "Explore a nearby gallery, bookstore, or public attraction.",
      },
      {
        time: "6:30 PM",
        title: `Dinner at ${restaurant.name}`,
        description:
          "Enjoy dinner while comparing your favorite cuisines.",
      },
      {
        time: "8:00 PM",
        title: "Share your music tastes",
        description: musicActivity,
      },
      {
        time: "9:00 PM",
        title: "Evening walk",
        description:
          "Finish with a relaxed walk and talk about your favorite discoveries.",
      },
    ],

    [
      {
        time: "5:30 PM",
        title: "Coffee and conversation",
        description:
          "Start at a café you both choose and discuss your favorite experiences.",
      },
      {
        time: "7:00 PM",
        title: `Dinner at ${restaurant.name}`,
        description:
          "Try something new together at your selected restaurant.",
      },
      {
        time: "8:30 PM",
        title: "Your cultural exchange",
        description: `${musicActivity} ${movieActivity}`,
      },
      {
        time: "9:30 PM",
        title: "Plan your next adventure",
        description:
          "Choose one new cuisine or cultural experience to explore next time.",
      },
    ],
  ];

  return variations[variation % variations.length];
}

// ============================================
// SHAREABLE TEXT
// ============================================

function createShareText(
  restaurant: Recommendation,
  steps: AdventureStep[],
  personA: Person,
  personB: Person,
  city: string
) {
  const lines = [
    "💕 TASTEMATCH AI — OUR ADVENTURE",
    "",
    `People: ${getName(personA, "Person A")} & ${getName(
      personB,
      "Person B"
    )}`,
    `City: ${city}`,
    `Restaurant: ${restaurant.name}`,
    `FairMatch Score: ${restaurant.fairScore}/100`,
    "",
    "OUR ADVENTURE",
    "",
  ];

  steps.forEach((step) => {
    lines.push(`${step.time} — ${step.title}`);
    lines.push(step.description);
    lines.push("");
  });

  lines.push(
    "Times are suggestions. Opening hours, availability, and reservations are not verified."
  );

  lines.push("");
  lines.push("Different tastes. One great adventure.");

  return lines.join("\n");
}

// ============================================
// MAIN APPLICATION
// ============================================

function App() {
  const [personA, setPersonA] = useState<Person>(DEFAULT_A);
  const [personB, setPersonB] = useState<Person>(DEFAULT_B);

  const [city, setCity] = useState("New York");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);

  const [favorites, setFavorites] =
    useState<Recommendation[]>(loadFavorites);

  const [hasSearched, setHasSearched] = useState(false);

  const [matchMode, setMatchMode] =
    useState<MatchMode>("balanced");

  const [selectedAdventure, setSelectedAdventure] =
    useState<Recommendation | null>(null);

  const [adventureVersion, setAdventureVersion] = useState(0);

  const [shareMessage, setShareMessage] = useState("");

  const nameA = getName(personA, "Person A");
  const nameB = getName(personB, "Person B");

  const comparison = getComparison(personA, personB);
  const sortedRecommendations = useMemo(() => {
    return [...recommendations].sort((a, b) => {
      if (matchMode === "personA") {
        return b.scoreA - a.scoreA || b.fairScore - a.fairScore;
      }
      
      if (matchMode === "personB") {
        return b.scoreB - a.scoreB || b.fairScore - a.fairScore;
      }
      
      return b.fairScore - a.fairScore;
    });
  }, [recommendations, matchMode]);

  

  const adventureSteps = selectedAdventure
    ? buildAdventure(
        selectedAdventure,
        personA,
        personB,
        adventureVersion
      )
    : [];

  // ============================================
  // UPDATE PROFILE
  // ============================================

  function updatePerson(
    type: "A" | "B",
    field: keyof Person,
    value: string
  ) {
    const setter = type === "A" ? setPersonA : setPersonB;

    setter((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // ============================================
  // FIND MATCH
  // ============================================

  async function findMatch() {
    if (!city.trim()) {
      setMessage("Please enter a city.");
      return;
    }

    setLoading(true);
    setMessage("");
    setRecommendations([]);
    setHasSearched(false);
    setMatchMode("balanced");

    try {
      const response = await fetch(`${API_URL}/api/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personA,
          personB,
          city: city.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details ||
            data.error ||
            "Unable to generate recommendations."
        );
      }

      const results = Array.isArray(data.recommendations)
        ? data.recommendations
        : [];

      setRecommendations(results);
      setHasSearched(true);

      setMessage(
        `Analyzed ${data.totalCandidates ?? results.length} restaurant candidates in ${city.trim()}.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // FAVORITES
  // ============================================

  function isFavorite(id: string) {
    return favorites.some((item) => item.id === id);
  }

  function toggleFavorite(restaurant: Recommendation) {
    setFavorites((previous) => {
      const exists = previous.some(
        (item) => item.id === restaurant.id
      );

      const updated = exists
        ? previous.filter((item) => item.id !== restaurant.id)
        : [...previous, restaurant];

      try {
        localStorage.setItem(
          FAVORITES_KEY,
          JSON.stringify(updated)
        );
      } catch {
        // Favorites remain available until the page reloads.
      }

      return updated;
    });
  }

  // ============================================
  // ADVENTURE MODAL
  // ============================================

  function openAdventure(restaurant: Recommendation) {
    setSelectedAdventure(restaurant);
    setAdventureVersion(0);
    setShareMessage("");
  }

  function closeAdventure() {
    setSelectedAdventure(null);
    setShareMessage("");
  }

  // ============================================
  // COPY
  // ============================================

  async function copyAdventure() {
    if (!selectedAdventure) return;

    const text = createShareText(
      selectedAdventure,
      adventureSteps,
      personA,
      personB,
      city
    );

    try {
      await navigator.clipboard.writeText(text);

      setShareMessage("Adventure copied to clipboard!");
    } catch {
      setShareMessage(
        "Copy failed. Clipboard access may require localhost or HTTPS."
      );
    }
  }

  // ============================================
  // SHARE
  // ============================================

  async function shareAdventure() {
    if (!selectedAdventure) return;

    const text = createShareText(
      selectedAdventure,
      adventureSteps,
      personA,
      personB,
      city
    );

    if (!navigator.share) {
      await copyAdventure();
      return;
    }

    try {
      await navigator.share({
        title: "Our TasteMatch Adventure",
        text,
      });

      setShareMessage("Adventure shared!");
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      setShareMessage("Unable to share this adventure.");
    }
  }

  // ============================================
  // DOWNLOAD AS PDF
  // ============================================

  function downloadPDF() {
    if (!selectedAdventure) return;

    // Browser print dialog provides "Save as PDF".
    window.print();
  }

  // ============================================
  // PERSON CARD
  // ============================================

  function personCard(
    person: Person,
    type: "A" | "B"
  ) {
    return (
      <div className={`person-card person-${type.toLowerCase()}`}>
        <div className="person-header">
          <div className="avatar">
            <Users size={22} />
          </div>

          <div>
            <span className="eyebrow">PERSON {type}</span>
            <h3>Your Taste Profile</h3>
          </div>
        </div>

        <label>
          Your Name
          <input
            value={person.name}
            placeholder="Enter your name"
            onChange={(event) =>
              updatePerson(type, "name", event.target.value)
            }
          />
        </label>

        <label>
          <UtensilsCrossed size={16} />
          Favorite Cuisine

          <select
            value={person.cuisine}
            onChange={(event) =>
              updatePerson(type, "cuisine", event.target.value)
            }
          >
            {CUISINES.map((cuisine) => (
              <option key={cuisine}>{cuisine}</option>
            ))}
          </select>
        </label>

        <label>
          Preferred Atmosphere

          <select
            value={person.vibe}
            onChange={(event) =>
              updatePerson(type, "vibe", event.target.value)
            }
          >
            {VIBES.map((vibe) => (
              <option key={vibe}>{vibe}</option>
            ))}
          </select>
        </label>

        <label>
          <Music size={16} />
          Favorite Music

          <input
            value={person.music}
            placeholder="e.g. Jazz, K-pop"
            onChange={(event) =>
              updatePerson(type, "music", event.target.value)
            }
          />
        </label>

        <label>
          <Clapperboard size={16} />
          Favorite Movie

          <input
            value={person.movie}
            placeholder="e.g. RRR, Interstellar"
            onChange={(event) =>
              updatePerson(type, "movie", event.target.value)
            }
          />
        </label>
      </div>
    );
  }

  // ============================================
  // CULTURAL TASTE DNA
  // ============================================

  function tasteProfile(
    person: Person,
    type: "A" | "B"
  ) {
    return (
      <div className={`dna-person dna-${type.toLowerCase()}`}>
        <div className="dna-person-heading">
          <div className="dna-avatar">{type}</div>

          <div>
            <span className="eyebrow">CULTURAL PROFILE</span>
            <h3>{getName(person, `Person ${type}`)}</h3>
          </div>
        </div>

        <div className="dna-taste-list">
          {DIMENSIONS.map(({ key, label }) => (
            <div className="dna-taste-row" key={key}>
              <span>{label}</span>
              <strong>
                {person[key].trim() || "Not added yet"}
              </strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================
  // RESTAURANT CARD
  // ============================================

  function restaurantCard(
    restaurant: Recommendation,
    index: number,
    showRank = true
  ) {
    return (
      <article
        className="recommendation-card"
        key={restaurant.id}
      >
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="restaurant-image"
            loading="lazy"
          />
        ) : (
          <div className="restaurant-image restaurant-placeholder">
            <UtensilsCrossed size={40} />
          </div>
        )}

        <div className="recommendation-content">
          <span className="rank-label">
            <Star size={13} />

            {showRank
              ? `#${index + 1} FAIRMATCH`
              : "SAVED RESTAURANT"}
          </span>

          <h3>{restaurant.name}</h3>

          <p className="restaurant-address">
            <MapPin size={15} />
            {getAddress(restaurant.address) || city}
          </p>

          <p className="restaurant-cuisine">
            <UtensilsCrossed size={14} />
            {restaurant.cuisine}
          </p>

          {restaurant.description && (
            <p>{restaurant.description}</p>
          )}

          <div className="score-row">
            <strong>
              <Heart size={17} />
              FairMatch Score
            </strong>

            <strong>{restaurant.fairScore}/100</strong>
          </div>

          <div className="score-bar">
            <div
              style={{
                width: `${Math.max(
                  0,
                  Math.min(100, restaurant.fairScore)
                )}%`,
              }}
            />
          </div>

          <div className="individual-scores">
            <span>
              {nameA}: {restaurant.scoreA}/100
            </span>

            <span>
              {nameB}: {restaurant.scoreB}/100
            </span>
          </div>

          <div className="match-explanation">
            <Sparkles size={16} />
            {restaurant.explanation}
          </div>

          {restaurant.tags?.length > 0 && (
            <div className="tag-list">
              {restaurant.tags.slice(0, 4).map((tag, i) => (
                <span key={`${tag}-${i}`}>{tag}</span>
              ))}
            </div>
          )}

          <div className="restaurant-actions">
            <button
              className="adventure-button"
              onClick={() => openAdventure(restaurant)}
            >
              <CalendarDays size={18} />
              Plan Our Adventure
            </button>

            <button
              className={`favorite-button ${
                isFavorite(restaurant.id) ? "saved" : ""
              }`}
              onClick={() => toggleFavorite(restaurant)}
              aria-pressed={isFavorite(restaurant.id)}
            >
              <Bookmark
                size={18}
                fill={
                  isFavorite(restaurant.id)
                    ? "currentColor"
                    : "none"
                }
              />

              {isFavorite(restaurant.id)
                ? "Saved"
                : "Save Favorite"}
            </button>
          </div>
        </div>
      </article>
    );
  }

  // ============================================
  // PAGE
  // ============================================

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <Heart size={20} fill="currentColor" />
          </div>

          <span>
            TasteMatch
            <span className="brand-ai"> AI</span>
          </span>
        </div>

        <div className="nav-badge">
          <Sparkles size={15} />
          Powered by Qloo
        </div>
      </header>

      <main>
        {/* HERO */}

        <section className="hero">
          <div className="hero-pill">
            <Sparkles size={14} />
            DISCOVER TOGETHER
          </div>

          <h1>
            Different tastes.
            <br />
            <span>One great adventure.</span>
          </h1>

          <p>
            Two people. Two unique worlds. Discover places
            you'll both love with the power of cultural
            intelligence.
          </p>
        </section>

        <section className="match-section">
          <div className="section-heading">
            <h2>Tell us what you love</h2>

            <p>
              We'll find the sweet spot between your worlds.
            </p>
          </div>

          {/* PERSON PROFILES */}

          <div className="profiles">
            {personCard(personA, "A")}

            <div className="heart-divider">
              <Heart size={24} fill="currentColor" />
            </div>

            {personCard(personB, "B")}
          </div>

          {/* CULTURAL TASTE DNA */}

          <section className="dna-section">
            <div className="dna-title-row">
              <span className="dna-icon">
                <Compass size={24} />
              </span>

              <div>
                <span className="eyebrow">
                  YOUR CULTURAL CONNECTION
                </span>

                <h2>Cultural Taste DNA</h2>

                <p>
                  See where your tastes meet and where
                  your adventures begin.
                </p>
              </div>
            </div>

            <div className="dna-grid">
              {tasteProfile(personA, "A")}
              {tasteProfile(personB, "B")}
            </div>

            <div className="dna-insights">
              <div className="dna-insight dna-shared">
                <h3>
                  <CheckCircle2 size={19} />
                  Shared tastes
                </h3>

                {comparison.shared.length ? (
                  <ul>
                    {comparison.shared.map(({ key, label }) => (
                      <li key={key}>
                        <strong>{label}:</strong>{" "}
                        {personA[key]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    No exact matches yet. Different
                    interests can lead to great discoveries.
                  </p>
                )}
              </div>

              <div className="dna-insight dna-different">
                <h3>
                  <Sparkles size={19} />
                  Opportunities to explore
                </h3>

                {comparison.different.length ? (
                  <ul>
                    {comparison.different.map(({ key, label }) => (
                      <li key={key}>
                        <strong>{label}:</strong>{" "}
                        {personA[key]} ↔ {personB[key]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    Enter both profiles to explore
                    your differences.
                  </p>
                )}
              </div>
            </div>

            <p className="dna-footnote">
              Compared {comparison.count} of 4 preference
              categories.
            </p>
          </section>

          {/* LOCATION */}

          <div className="location-panel">
            <div>
              <h3>
                <MapPin size={20} />
                Where are we exploring?
              </h3>

              <p>
                Choose the city for your shared adventure.
              </p>
            </div>

            <input
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
              placeholder="Enter a city"
            />
          </div>

          {/* FIND MATCH */}

          <button
            className="match-button"
            onClick={findMatch}
            disabled={loading || !city.trim()}
          >
            {loading ? (
              <>
                <Sparkles size={20} />
                Discovering your match...
              </>
            ) : (
              <>
                Find Our Match
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {message && (
            <div className="result-message" role="status">
              <Sparkles size={20} />
              <p>{message}</p>
            </div>
          )}

          {/* RECOMMENDATIONS */}

          {recommendations.length > 0 && (
            <section className="recommendations">
              <div className="section-heading">
                <h2>
                  <Heart size={26} fill="currentColor" />
                  Your FairMatch Recommendations
                </h2>

                <p>
                  Places ranked to balance both
                  people's preferences.
                </p>
              </div>

              {/* NEGOTIATION */}

              <div className="negotiation-panel">
                <div className="negotiation-heading">
                  <Sparkles size={24} />

                  <div>
                    <h3>Taste Negotiation</h3>

                    <p>
                      Choose whose preferences to prioritize.
                    </p>
                  </div>
                </div>

                <div className="negotiation-options">
                  <button
                    className={
                      matchMode === "balanced" ? "active" : ""
                    }
                    onClick={() => setMatchMode("balanced")}
                  >
                    ❤️ Most Balanced
                  </button>

                  <button
                    className={
                      matchMode === "personA" ? "active" : ""
                    }
                    onClick={() => setMatchMode("personA")}
                  >
                    🍽️ {nameA}'s Choice
                  </button>

                  <button
                    className={
                      matchMode === "personB" ? "active" : ""
                    }
                    onClick={() => setMatchMode("personB")}
                  >
                    ✨ {nameB}'s Choice
                  </button>
                </div>

                <p className="negotiation-insight">
                  {matchMode === "balanced"
                    ? "Prioritizing balanced compatibility for both people."
                    : matchMode === "personA"
                      ? `Prioritizing ${nameA}'s preferences.`
                      : `Prioritizing ${nameB}'s preferences.`}
                </p>
              </div>

              <div className="recommendation-grid">
                {sortedRecommendations.map((restaurant, index) =>
                  restaurantCard(restaurant, index)
                )}
              </div>

              <p className="scoring-disclaimer">
                FairMatch scores are TasteMatch estimates
                based on Qloo data, not official Qloo
                compatibility percentages.
              </p>
            </section>
          )}

          {hasSearched && recommendations.length === 0 && (
            <div className="result-message">
              No restaurant matches found.
              Try another city or preferences.
            </div>
          )}

          {/* SAVED FAVORITES */}

          {favorites.length > 0 && (
            <section className="favorites-section">
              <div className="section-heading">
                <h2>
                  <Bookmark size={25} />
                  Saved Favorites
                </h2>

                <p>
                  Your saved restaurants are stored
                  in this browser.
                </p>
              </div>

              <div className="recommendation-grid">
                {favorites.map((restaurant, index) =>
                  restaurantCard(restaurant, index, false)
                )}
              </div>
            </section>
          )}
        </section>

        <footer>
          <Heart size={14} />
          Made for different tastes, powered by Qloo.
        </footer>
      </main>

      {/* ADVENTURE MODAL */}

      {selectedAdventure && (
        <div
          className="adventure-backdrop"
          onClick={closeAdventure}
        >
          <section
            className="adventure-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="adventure-heading"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="adventure-close no-print"
              onClick={closeAdventure}
              aria-label="Close adventure"
            >
              <X size={21} />
            </button>

            <span className="eyebrow">
              YOUR SHARED ADVENTURE
            </span>

            <h2 id="adventure-heading">
              <Compass size={26} />
              Our TasteMatch Adventure
            </h2>

            <p className="adventure-intro">
              A suggested evening for{" "}
              <strong>{nameA}</strong> and{" "}
              <strong>{nameB}</strong> in {city}.
            </p>

            <div className="adventure-restaurant">
              <UtensilsCrossed size={20} />

              <div>
                <strong>{selectedAdventure.name}</strong>

                <p>
                  FairMatch:{" "}
                  {selectedAdventure.fairScore}/100
                </p>
              </div>
            </div>

            <div className="adventure-timeline">
              {adventureSteps.map((step) => (
                <div
                  className="adventure-step"
                  key={`${adventureVersion}-${step.time}`}
                >
                  <span className="adventure-time">
                    <Clock3 size={15} />
                    {step.time}
                  </span>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="adventure-disclaimer">
              Suggested itinerary only. Opening hours,
              travel times, venue availability, and
              reservations have not been verified.
            </p>

            {/* SHARE BUTTONS */}

            <div className="share-actions no-print">
              <button onClick={copyAdventure}>
                <Copy size={17} />
                Copy
              </button>

              <button onClick={shareAdventure}>
                <Share2 size={17} />
                Share
              </button>

              <button onClick={downloadPDF}>
                <Download size={17} />
                Save PDF
              </button>

              <button
                onClick={() => {
                  setAdventureVersion((value) => value + 1);
                  setShareMessage("");
                }}
              >
                <RefreshCw size={17} />
                Plan Again
              </button>
            </div>

            {shareMessage && (
              <p className="share-message no-print" role="status">
                {shareMessage}
              </p>
            )}

            <button
              className="adventure-done no-print"
              onClick={closeAdventure}
            >
              Back to Matches
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;