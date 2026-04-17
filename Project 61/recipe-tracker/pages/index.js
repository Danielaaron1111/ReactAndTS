// pages/index.js — Home page: lists all recipes with search filtering
//
// THIS FILE DEMONSTRATES ALL 6 STEPS WORKING TOGETHER:
// Step 1: useState for search term (controlled input in RecipeList)
// Step 2: useEffect to fetch recipes from the API on page load
// Step 3: Favorites state + POST handler (in RecipeCard via context)
// Step 4: FavoritesContext.Provider wraps children (removes prop drilling)
// Step 5: Navigation via NavBar (links to /favorites and /recipe/[id])
//
// In C#, this page would be like a Razor Page with OnGetAsync() that loads data,
// and a ViewModel with ObservableCollections for recipes and favorites.

import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import NavBar from "@/components/NavBar";
import RecipeList from "@/components/RecipeList";
import { getRecipes, getFavorites } from "@/utils/api/recipes";
import { FavoritesContext } from "@/utils/api/FavoritesContext";

export default function Home() {
  // State variables — like private fields in a C# ViewModel
  const [recipes, setRecipes] = useState([]);       // All recipes from the API
  const [favorites, setFavorites] = useState([]);    // User's favorited recipes
  const [loading, setLoading] = useState(true);      // Loading spinner flag

  // ============================================================
  // STEP 2: useEffect — runs side effects after the component renders
  //
  // useEffect is like C#'s OnInitializedAsync() in Blazor or
  // Page_Load in ASP.NET WebForms.
  //
  // The empty dependency array [] means "run this ONCE when the component first mounts"
  // (like constructor or ngOnInit). Without [], it would run on EVERY render.
  //
  // We use async/await inside — but useEffect itself can't be async,
  // so we define an async function inside and call it immediately.
  // ============================================================
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch recipes and favorites in parallel
        // In C#: await Task.WhenAll(GetRecipes(), GetFavorites());
        const recipesData = await getRecipes();
        const favoritesData = await getFavorites();
        setRecipes(recipesData);
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false); // Hide spinner whether fetch succeeded or failed
      }
    }
    loadData();
  }, []); // [] = dependency array — empty means "run once on mount"

  return (
    <main>
      <NavBar />
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mt: 3, mb: 1 }}>
          All Recipes
        </Typography>

        {/* Conditional rendering: show spinner while loading, list when done */}
        {/* In C#: if (IsLoading) { ShowSpinner(); } else { ShowList(); } */}

        {/* ================================================================
            🎯 BONUS CHALLENGE 3: Loading Skeleton
            Instead of CircularProgress, try rendering 3-4 skeleton cards:
              import Skeleton from "@mui/material/Skeleton";
            Render them inside a flex Box (same layout as recipe cards):
              <Skeleton variant="rectangular" width={320} height={200} />
            This gives users a visual preview of the layout while loading.
            C# analogy: like showing a placeholder template in a DataGrid
            ================================================================ */}

        {/* ================================================================
            🎯 BONUS CHALLENGE 10: Local Storage Persistence
            Add a second useEffect that saves favorites to localStorage
            whenever they change:
              useEffect(() => {
                localStorage.setItem("favorites", JSON.stringify(favorites));
              }, [favorites]);  // <-- [favorites] means "run when favorites changes"
            And in your loadData function, check localStorage FIRST:
              const cached = localStorage.getItem("favorites");
              if (cached) { setFavorites(JSON.parse(cached)); }
            C# analogy: localStorage is like IsolatedStorage or browser cookies
            ================================================================ */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <CircularProgress />
          </Box>
        ) : (
          // STEP 4: FavoritesContext.Provider wraps RecipeList
          // The "value" prop is what useContext(FavoritesContext) returns
          // Any child component (RecipeList → RecipeCard) can access favorites and setFavorites
          // without us having to pass them as props through every level
          <FavoritesContext.Provider value={{ favorites, setFavorites }}>
            <RecipeList recipes={recipes} />
          </FavoritesContext.Provider>
        )}
      </Container>
    </main>
  );
}
