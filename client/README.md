

Readme · MD
# ☕ The Brew Review
 
A full-stack coffee shop discovery app for Austin, TX — think Letterboxd/RateMyProfessor, but for coffee shops. Browse and filter cafés by vibe, get an AI-powered recommendation based on what you're looking for, and (soon) leave your own reviews.
 
**🔗 Live site:** [thebrewreview.onrender.com](https://thebrewreview-1.onrender.com)
 
---

## A sneak peak

![Discovery Preview](./DiscoverPreview.png)
![Shop Details Preview](./ShopDetailsPreview.png)
 
## Features
 
- 🔍 **Search & filter** — search by name/address, filter by tags (wifi, quiet, outdoor, etc.), sort by rating
- 🤖 **AI recommendations** — describe what you're looking for in plain language, powered by Google's Gemini API
- 🗺️ **Discovery map view** — visual layout of shop locations
- 📄 **Shop detail pages** — dedicated, shareable URL per shop via client-side routing
- ⭐ **Highly rated nearby** — quick-access curated top picks
## Tech Stack
 
**Frontend:** React (Vite), React Router, plain CSS
**Backend:** Node.js, Express
**AI:** Google Gemini API (prompt-engineered recommendations)
**Deployment:** Render (separate Web Service for API, Static Site for frontend)
 
## Architecture
 
```
React (frontend)  →  fetch()  →  Express API (backend)  →  Gemini API
     ↑                                    ↓
  Client-side routing              In-memory shop data
  (React Router)                   (planned: real database)
```
 
## API Endpoints
 
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/shops` | Returns all coffee shops |
| POST | `/api/recommendations` | Takes `{ criteria: string }`, returns an AI-generated shop recommendation |
 
## Roadmap
 
- [ ] Real database (currently in-memory data, resets on server restart)
- [ ] User accounts and authentication
- [ ] Actual review/rating submission (currently placeholder)
- [ ] Real map integration with geocoded coordinates
- [ ] Saved/favorited shops per user
## A Note on Process
 
This project was built while actively learning JavaScript, React, and Node/Express for the first time — used Claude as a debugging and learning partner throughout (similar to how one might use documentation or a pairing partner), while writing, testing, and understanding every line personally.
 
