# 🍳 Recipe Tracker — React Fundamentals Practice Project

A Next.js 14 (Pages Router) project that teaches React fundamentals through 6 progressive steps. Built with the same tech stack used in the school lab.

## Tech Stack

- **Next.js 14** (Pages Router)
- **React 18**
- **MUI 5** (@mui/material) for UI components
- **Prisma** with **SQLite** for the database
- **@fontsource/roboto** for typography

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate --schema ./prisma-backend-tools/schema.prisma
   ```

3. **Create the database:**
   ```bash
   npx prisma db push --schema ./prisma-backend-tools/schema.prisma
   ```

4. **Seed the database with sample recipes:**
   ```bash
   node prisma-backend-tools/seedDatabase.mjs
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser** and go to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
recipe-tracker/
├── components/             # Reusable UI components
│   ├── NavBar.js           # Navigation bar (Home + Favorites links)
│   ├── RecipeList.js       # Recipe list with search filtering
│   ├── RecipeCard.js       # Single recipe card with Favorite button
│   ├── ReviewList.js       # Displays reviews for a recipe
│   └── ReviewForm.js       # Controlled form to submit a review
├── pages/
│   ├── _app.js             # Root component (global CSS, fonts)
│   ├── _document.js        # HTML document structure
│   ├── index.js            # Home page: all recipes
│   ├── favorites.js        # Favorites page: saved recipes
│   ├── recipe/[id].js      # Recipe detail page + reviews
│   └── api/
│       ├── recipes/
│       │   ├── index.js            # GET /api/recipes
│       │   ├── [recipeId].js       # GET /api/recipes/:id
│       │   └── [recipeId]/
│       │       └── reviews.js      # GET/POST /api/recipes/:id/reviews
│       └── favorites/
│           ├── index.js            # GET/POST /api/favorites
│           └── [favoriteId].js     # DELETE /api/favorites/:id
├── utils/api/
│   ├── recipes.js          # Fetch helper functions
│   └── FavoritesContext.js # React Context for favorites
├── prisma-backend-tools/
│   ├── schema.prisma       # Database schema
│   ├── recipes.json        # Seed data (6 recipes)
│   ├── seedDatabase.mjs    # Seed script
│   └── localClient.js      # Prisma singleton client
├── styles/globals.css      # Global styles
├── STEPS.md                # Step-by-step learning guide
└── README.md               # This file
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run generate-db` | Generate Prisma client |
| `npm run populate-db` | Seed the database |
| `npm run navigate-db` | Open Prisma Studio (database browser) |

## Learning Path

See **STEPS.md** for a detailed 6-step guide explaining the React concepts taught in each step.
