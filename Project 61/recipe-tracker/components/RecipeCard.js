// RecipeCard.js — Displays a single recipe as a MUI Card
//
// STEP 3 CONCEPT: POST fetch + event handlers + .some()
// STEP 4 CONCEPT: useContext (consuming the FavoritesContext instead of receiving props)
//
// useContext lets this component grab favorites data directly from the context,
// instead of receiving it through props drilled down from parent components.
// In C#, this is like using Dependency Injection: instead of passing a service
// through every constructor, you just [Inject] it where you need it.

import { useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import { FavoritesContext } from "@/utils/api/FavoritesContext";
import { postFavorite } from "@/utils/api/recipes";

export default function RecipeCard({ recipe }) {
  // useContext grabs the value from the nearest FavoritesContext.Provider above in the tree
  // This replaces prop drilling — no need for RecipeList to pass favorites down
  const { favorites, setFavorites } = useContext(FavoritesContext);

  // .some() is like LINQ's .Any() in C# — returns true if ANY item matches the condition
  // Here we check: "Is this recipe already in the favorites list?"
  // C# equivalent: favorites.Any(f => f.recipeId == recipe.Id)
  const isFavorited = favorites.some((fav) => fav.recipeId === recipe.id);

  // Event handler for the Favorite button click
  // async because we're making a POST request to the API
  const handleFavorite = async () => {
    try {
      // POST to /api/favorites — saves this recipe as a favorite in the database
      const newFavorite = await postFavorite(recipe.id);

      // Update local state by adding the new favorite to the existing array
      // The spread operator (...) creates a new array with all existing items plus the new one
      // In C#: favorites = new List<Favorite>(favorites) { newFavorite };
      setFavorites([...favorites, newFavorite]);
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  };

  return (
    <Card sx={{ width: 320, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Typography is MUI's text component — variant controls size/style */}
        <Typography variant="h6" gutterBottom>
          {recipe.title}
        </Typography>

        {/* Chip is a small label — great for showing categories */}
        <Chip label={recipe.category} color="primary" size="small" sx={{ mb: 1 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          ⏱ Prep Time: {recipe.prepTime}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap>
          {recipe.ingredients}
        </Typography>
      </CardContent>

      <CardActions>
        {/* Link to the recipe detail page — dynamic route using the recipe's ID */}
        <Link href={`/recipe/${recipe.id}`} passHref style={{ textDecoration: "none" }}>
          <Button size="small">View Details</Button>
        </Link>

        {/* Favorite button: disabled if already favorited */}
        {/* disabled prop is like IsEnabled = false in C# WPF */}
        <Button
          size="small"
          color="secondary"
          onClick={handleFavorite}
          disabled={isFavorited}
        >
          {isFavorited ? "★ Favorited" : "☆ Favorite"}
        </Button>

        {/* ================================================================
            🎯 BONUS CHALLENGE 4 (from favorites.js): Confirm Before Remove
            When you work on the favorites page, try wrapping the delete call in:
              if (window.confirm("Are you sure?")) { ... }
            It's like MessageBox.Show() in C# WPF — blocks until user decides
            ================================================================ */}
      </CardActions>
    </Card>
  );
}
