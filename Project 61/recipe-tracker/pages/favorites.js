// pages/favorites.js — Favorites page: shows saved recipes with a Remove button
//
// STEP 5 CONCEPT: Multi-page routing + DELETE fetch + .filter() state update
//
// This page demonstrates:
// - A separate page accessible via next/link navigation
// - Fetching favorites with useEffect (like Step 2)
// - DELETE request to remove a favorite
// - .filter() to update state after deletion
//   (.filter() is like LINQ's .Where() — it creates a NEW array excluding the removed item)

import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { getFavorites, deleteFavorite } from "@/utils/api/recipes";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites on page load — same pattern as Step 2
  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  // DELETE handler — removes a favorite from the database and updates local state
  const handleRemove = async (favoriteId) => {
    // ==========================================================================
    // 🎯 BONUS CHALLENGE 4: Confirm Before Remove
    // Before calling deleteFavorite, ask the user to confirm:
    //   if (!window.confirm("Remove this recipe from favorites?")) return;
    // This one-liner stops the function if the user clicks "Cancel"
    // C# analogy: like MessageBox.Show("Sure?", ..., MessageBoxButton.YesNo)
    // ==========================================================================
    try {
      await deleteFavorite(favoriteId);

      // .filter() creates a new array WITHOUT the removed item
      // In C#: favorites = favorites.Where(f => f.Id != favoriteId).ToList();
      // We NEVER mutate state directly in React — always create a new array/object
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <main>
      <NavBar />
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
          ★ My Favorite Recipes
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <CircularProgress />
          </Box>
        ) : favorites.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            You haven&apos;t saved any favorites yet. Go to the{" "}
            <Link href="/">Home page</Link> to find recipes you love!
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {favorites.map((fav) => (
              <Card key={fav.id} sx={{ width: 320 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {fav.recipe.title}
                  </Typography>
                  <Chip label={fav.recipe.category} color="primary" size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    ⏱ Prep Time: {fav.recipe.prepTime}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link href={`/recipe/${fav.recipe.id}`} passHref style={{ textDecoration: "none" }}>
                    <Button size="small">View Details</Button>
                  </Link>
                  {/* Remove button calls DELETE API and updates state */}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemove(fav.id)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </main>
  );
}
