# TDAM: The Digital Art Museum

## Final Year Project - TUDublin
## Iria Parada
### Supervisor: Art Sloan

TDAM is a mobile app that helps people discover public artworks through a personalised recommendation system and custom collections, allowing users to explore, organise, and revisit the pieces they love.

What makes it more than just a gallery browser is the machine learning model underneath, which learns each user's preferences and personalises both the artwork feed and the collections feed over time.

Built as my final year project at TU Dublin — awarded a First Class Honours.

Full-stack mobile application
<br>
![ReactNative](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Springboot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## Demo

[![TDAM Demo](https://img.youtube.com/vi/xevJS7LW4og/0.jpg)](https://www.youtube.com/watch?v=xevJS7LW4og)

---

## About

Art has increasingly moved into digital spaces, letting people explore artworks outside traditional museum settings. TDAM makes public artworks more accessible through personalised discovery and user-curated collections, combining museum APIs, a full-stack architecture, and a content-based recommendation model.

After registering, users complete a short onboarding survey selecting the artistic styles, movements, periods and artists they're drawn to. This seeds the recommendation model before any interaction data exists. From there, users land on the **artwork feed**, where they can browse a "For You" category powered by the ML model alongside other dynamically generated categories, search for specific pieces, and save the ones they like. Every artwork has a detail page and links through to an **artist detail** page (with a link to the artist's Wikipedia entry). Saved artworks can be organised into **collections** — public or private — similar to how a playlist works in a music app. The **collections feed** mirrors this experience, surfacing other users' public collections through the same recommendation model, since both feeds are driven by the same user preference and interaction data.

TDAM isn't a social media platform — there's no uploading, posting, or following. The focus stays on art discovery, learning, and curation, with public collections as a light social layer on top.

---

## Features

- Email/username + password authentication
- Onboarding preference survey (movements, styles, time periods, artists, mediums) used to seed the ML model
- Personalised "For You" artwork feed, plus dynamically generated categories
- Artwork search and browsing across two museum APIs
- Artwork detail pages with view tracking (feeds the recommendation model)
- Artist detail pages linking out to Wikipedia
- Save artworks and organise them into custom collections
- Public/private collection visibility toggle
- Personalised public collections feed
- User profiles with editable bio/avatar and a list of the user's collections

---

## Tech Stack

**Frontend**
- React Native (Expo)
- MVVM architecture

**Backend**
- Spring Boot (Java)
- Layered architecture: Controller → Service → Repository, with DTOs for API contracts
- Spring Security (CORS configuration)

**Database**
- PostgreSQL, managed with pgAdmin4

**Machine Learning**
- Python, scikit-learn, pandas
- Served via a Flask API, called by the Spring Boot backend

**Art Data**
- [The Metropolitan Museum of Art Collection API](https://metmuseum.github.io/)
- [Harvard Art Museums API](https://harvardartmuseums.org/collections/api)

**Deployment**
- Docker (containerised backend)
- Backend hosted on a personal NAS home server, exposed via a Cloudflare Tunnel

---

## Recommendation System

TDAM uses a content-based recommendation model to personalise both the artwork feed and the collections feed:

> P(user will like artwork | artwork metadata + user preferences + past behaviour)
> (User U, Artwork A) → liked (0 or 1)

**Data sources:**
- The onboarding preference survey (movements, time periods, styles, artists, mediums)
- Saved artworks / artworks added to a collection
- Artwork "views" (opening an artwork's detail page counts as a view)

**Model:** After comparing Naive Bayes, Decision Tree and KNN, a **Naive Bayes classifier with TF-IDF features** was chosen. It suits the sparse, high-dimensional nature of artwork metadata, is efficient enough to serve recommendations in real time, and continuous probability scores allow the feed to be ranked and refined as a user interacts more with the app — rather than relying solely on nearby data points, as KNN would.

---

## Architecture

- **Frontend:** MVVM — Views, ViewModels (state + business logic), and Models per feature (artwork, collection, user)
- **Backend:** REST API with clear separation between Controllers, Services, Repositories and DTOs
- **Database:** PostgreSQL storing users, collections, collection–artwork links, and artwork view history for the recommendation model
- **ML Service:** Standalone Flask API consuming survey, save, and view data and returning personalised rankings to the Spring Boot backend
- **Deployment:** Backend containerised with Docker and hosted on a personal NAS server, tunnelled to the internet via Cloudflare

---

## Links

- **Privacy Policy:** https://iriapm.github.io/tdam-privacy-policy/
