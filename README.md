# TasteMatch AI
### Different Tastes. One Great Adventure.

## Inspiration

Have you ever spent 30 minutes trying to decide where to eat with a friend, partner, or family member?

One person wants Indian food, while the other prefers Italian. One loves quiet, cozy restaurants, while the other wants something lively and adventurous.

Even something as simple as choosing a restaurant can become surprisingly complicated when two people have different preferences.

Most recommendation platforms focus on what one person likes. But real-life experiences are often shared.

That made me wonder:

**What if technology could help two people discover experiences they would both enjoy, instead of forcing one person to compromise?**

That question inspired me to build **TasteMatch AI**, a cultural discovery application powered by Qloo.

My goal was to make discovering new places more personal, collaborative, and enjoyable.

Rather than treating different preferences as a problem, TasteMatch AI treats them as an opportunity to explore something new together.

## What it does

TasteMatch AI helps two people discover restaurants and shared experiences based on their individual cultural preferences.

Instead of simply recommending popular places, the application brings together two taste profiles and helps users understand where their interests overlap.

### 1. Personalized Taste Profiles

Users begin by entering their individual preferences, including interests such as cuisine, music, movies, and atmosphere.

For example, Alex might love Indian cuisine and jazz, while Sam prefers Italian food and pop music.

TasteMatch AI considers both profiles when generating recommendations.

### 2. Qloo-Powered Restaurant Discovery

TasteMatch AI integrates Qloo's cultural intelligence API to retrieve restaurant recommendations.

The application uses this information alongside user preferences to help identify places that may appeal to both people.

Instead of searching through endless restaurant listings, users can explore a more focused set of options.

### 3. Cultural Taste DNA

Cultural Taste DNA helps users understand how their preferences compare.

It highlights shared interests, differences, and opportunities to explore something outside their usual preferences.

The goal is to make cultural compatibility easier to understand without reducing someone's personality to a single number.

### 4. FairMatch Scoring

TasteMatch AI includes a FairMatch scoring system that evaluates recommendations from the perspective of both users.

Instead of optimizing exclusively for one person, the scoring system helps identify options that balance their preferences.

This encourages fairer decisions and makes it easier to understand why a particular recommendation might work for both people.

### 5. Taste Negotiation

Sometimes two people have very different expectations.

Taste Negotiation helps users explore alternative ways to balance their interests.

Rather than assuming one person's preferences should always win, TasteMatch AI supports a more collaborative approach to choosing experiences.

### 6. Adventure Planner

TasteMatch AI goes beyond restaurant discovery.

The Adventure Planner helps users explore ideas for shared outings based on their preferences and recommendations.

This turns a simple restaurant search into a more complete discovery experience.

### 7. Favorites and Sharing

Users can save interesting recommendations and share discoveries with others.

This makes it easier to revisit potential experiences and plan something together.

**Ultimately, TasteMatch AI is about helping people connect through cultural discovery, even when their preferences are different.**

## How I built it

I built TasteMatch AI as a full-stack web application, with a React and TypeScript frontend and a Node.js and Express backend.

### Frontend Development

I used React, TypeScript, and Vite to create an interactive, responsive web application.

The frontend allows users to enter preferences, compare cultural interests, explore restaurant recommendations, and interact with the application's discovery features.

I focused on creating a visually engaging interface that makes the experience approachable, even for someone using the application for the first time.

### Backend Development

I developed the backend using Node.js and Express.

The backend handles API requests, communicates with Qloo, and returns restaurant data to the frontend.

Separating the frontend and backend also allows the Qloo API credentials to remain on the server rather than being exposed in browser code.

### Qloo API Integration

Qloo is a central component of TasteMatch AI.

I integrated Qloo's cultural intelligence API to retrieve restaurant recommendations that the application can evaluate against user preferences.

The application combines the returned restaurant information with its own preference-comparison and recommendation logic.

This integration helped transform TasteMatch AI from a basic preference form into a cultural discovery experience.

### FairMatch and Cultural Comparison

I implemented application-level logic to compare two users' preferences and calculate FairMatch scores.

The scoring system is designed to make recommendations more balanced and understandable.

Cultural Taste DNA presents preference similarities and differences in a way that users can explore visually.

### Deployment

I deployed the frontend using Vercel and the backend using Render.

The source code is hosted on GitHub.

This setup allowed me to make TasteMatch AI accessible through a public website, rather than limiting it to a local development environment.

### Technologies Used

- React
- TypeScript
- Vite
- JavaScript
- Node.js
- Express.js
- Qloo API
- REST APIs
- Vercel
- Render
- Git
- GitHub
- Visual Studio Code

## Challenges I ran into

### 1. Combining Two Different Taste Profiles

One of the biggest challenges was designing a recommendation experience for two people instead of one.

When users have different preferences, simply combining their interests does not necessarily produce a fair result.

I approached this by developing preference-comparison logic and FairMatch scoring to help balance both perspectives.

### 2. Integrating the Qloo API

Working with an external cultural intelligence API required understanding its request structure, response data, and how that information could support my application's features.

I had to connect the backend to Qloo, process restaurant information, and make the results useful within the frontend.

### 3. Turning Recommendations Into an Experience

I didn't want TasteMatch AI to feel like another restaurant search website.

I wanted users to understand their shared interests, explore differences, and discover new experiences together.

This led me to develop features such as Cultural Taste DNA, Taste Negotiation, and Adventure Planner.

### 4. Connecting the Frontend and Backend

Another challenge was making the application work outside my local development environment.

During deployment, I had to configure environment variables, connect the Vercel frontend to the Render backend, and ensure the application could communicate with its APIs.

Getting the complete application running through a public website was an important milestone.

### 5. Designing a User-Friendly Interface

TasteMatch AI combines several concepts, including cultural preferences, compatibility, recommendations, and shared planning.

Presenting all this information without overwhelming users required careful attention to the interface and user experience.

I focused on keeping the design colorful, approachable, and easy to navigate.

## Accomplishments that I'm proud of

The accomplishment I'm most proud of is taking TasteMatch AI from an initial idea to a working, publicly deployed application.

I successfully integrated Qloo into a full-stack project and built an experience around two-person cultural discovery.

I'm especially proud of:

- Building a working Qloo-powered restaurant recommendation experience.
- Creating Cultural Taste DNA to help users understand shared preferences.
- Implementing FairMatch scoring to encourage balanced recommendations.
- Adding Taste Negotiation to support collaborative decisions.
- Developing Adventure Planner to extend discovery beyond a single recommendation.
- Building a responsive frontend using React and TypeScript.
- Deploying the frontend and backend as a publicly accessible application.

Most importantly, I built something that addresses a familiar, everyday problem in a different way.

TasteMatch AI demonstrates how cultural intelligence can support not only personalized recommendations but also shared decision-making.

## What I learned

Building TasteMatch AI taught me a lot about full-stack development, API integration, and designing technology around real human experiences.

I gained practical experience connecting a React frontend to an Express backend and integrating an external API into a functioning application.

I also learned that recommendation systems become more interesting when they consider multiple perspectives.

A recommendation that works perfectly for one person might not work for two people making a decision together.

This project helped me think more carefully about fairness, preference balancing, and explainability in recommendation systems.

I also gained experience deploying a complete application, managing environment variables, troubleshooting API connections, and preparing a project for real users.

One of my biggest takeaways is that useful technology doesn't always need to solve a complicated problem.

Sometimes, making an everyday decision easier, fairer, and more enjoyable can create meaningful value.

## What's next for TasteMatch AI

TasteMatch AI is only the beginning.

In the future, I would like to expand the application into a more intelligent cultural discovery and planning assistant.

### 1. AI-Powered Conversational Planning

I want to introduce a conversational assistant that can understand natural-language requests, ask follow-up questions, and refine recommendations through multiple interactions.

For example, users could ask:

"Find something romantic in New York that combines my love for Indian food with my partner's preference for Italian cuisine."

The assistant could then explore options and help users refine their plans.

### 2. More Cultural Experiences

I plan to expand beyond restaurants into concerts, movies, museums, cafés, and other activities.

This would allow users to plan more complete experiences around their shared interests.

### 3. Multi-Person Taste Matching

Currently, TasteMatch AI focuses on two people.

In the future, I want to support groups of friends, families, and teams.

The challenge would be finding experiences that balance the preferences of several people fairly.

### 4. Smarter Recommendation Explanations

I want to improve how TasteMatch AI explains its recommendations.

Rather than simply displaying a score, the application could provide more detailed explanations of why an experience is a good match.

### 5. Autonomous Planning Agents

A longer-term goal is to introduce an AI agent that can plan and refine an outing across multiple steps.

Such an agent could use cultural intelligence to discover options, compare preferences, respond to feedback, and revise an itinerary.

### 6. A More Complete Shared Discovery Platform

My long-term vision is to make TasteMatch AI a platform where people can discover new experiences together, regardless of how different their tastes may be.

Because having different interests shouldn't make spending time together harder.

**Different tastes. One great adventure.**
