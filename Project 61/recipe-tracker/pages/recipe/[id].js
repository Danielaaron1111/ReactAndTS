// pages/recipe/[id].js — Recipe detail page with reviews
//
// STEP 5 CONCEPT: Dynamic routes with useRouter
// STEP 6 CONCEPT: Review form with controlled inputs + POST + error handling
//
// The filename [id].js means this is a DYNAMIC route.
// When you visit /recipe/3, Next.js passes { id: "3" } as a query parameter.
// This is like C# MVC's [Route("recipe/{id}")] attribute routing.
//
// useRouter is Next.js's hook for accessing route info.
// In C#, it's like HttpContext.Request.RouteValues["id"].

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import { getRecipeById, getReviews } from "@/utils/api/recipes";

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useRouter gives us access to the dynamic route parameter [id]
  // router.query.id will be "3" if the URL is /recipe/3
  const router = useRouter();
  const { id } = router.query;

  // Fetch recipe and reviews when the id is available
  // We put [id] in the dependency array so it re-fetches if the id changes
  useEffect(() => {
    // id is undefined on the first render (Next.js hydration), so we wait
    if (!id) return;

    async function loadRecipeData() {
      try {
        // Fetch recipe details and reviews
        const recipeData = await getRecipeById(id);
        const reviewsData = await getReviews(id);
        setRecipe(recipeData);
        setReviews(reviewsData);
      } catch (err) {
        setError("Failed to load recipe. Please try again.");
        console.error("Error loading recipe:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRecipeData();
  }, [id]); // Re-run when id changes

  // Callback passed to ReviewForm — adds the new review to state
  // This is like an event handler: Action<Review> OnReviewAdded in C#
  const handleReviewAdded = (newReview) => {
    // Spread operator creates a new array with all existing reviews + the new one
    // In C#: reviews = new List<Review>(reviews) { newReview };
    setReviews([...reviews, newReview]);
  };

  if (loading) {
    return (
      <main>
        <NavBar />
        <Container>
          <Box sx={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <CircularProgress />
          </Box>
        </Container>
      </main>
    );
  }

  if (error || !recipe) {
    return (
      <main>
        <NavBar />
        <Container>
          <Typography variant="h6" color="error" sx={{ mt: 3 }}>
            {error || "Recipe not found."}
          </Typography>
          <Link href="/" passHref>
            <Button sx={{ mt: 2 }}>← Back to Home</Button>
          </Link>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 3, mb: 5 }}>
        {/* Back button */}
        <Link href="/" passHref style={{ textDecoration: "none" }}>
          <Button sx={{ mb: 2 }}>← Back to All Recipes</Button>
        </Link>

        {/* Recipe title and metadata */}
        <Typography variant="h4" gutterBottom>
          {recipe.title}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Chip label={recipe.category} color="primary" />
          <Chip label={`⏱ ${recipe.prepTime}`} variant="outlined" />
        </Box>

        {/* Ingredients section */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Ingredients
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {recipe.ingredients}
        </Typography>

        {/* Instructions section */}
        <Typography variant="h6">Instructions</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {recipe.instructions}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* ================================================================
            🎯 BONUS CHALLENGE 5: Average Rating Display
            Before the ReviewList, calculate and show the average rating:
              const avgRating = reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;
            .reduce() is like LINQ's .Aggregate() — it collapses an array into
            a single value by accumulating. Here: sum starts at 0, adds each rating.
            C# equivalent: reviews.Average(r => r.Rating)
            Display it with: <Typography>Average: {avgRating.toFixed(1)} ★</Typography>
            .toFixed(1) rounds to 1 decimal place (e.g. "4.2")
            Handle the 0-reviews case — don't show "Average: NaN ★" !
            ================================================================ */}

        {/* Reviews section — Step 6 */}
        <ReviewList reviews={reviews} />

        {/* Review form — Step 6: controlled form with POST */}
        <ReviewForm recipeId={recipe.id} onReviewAdded={handleReviewAdded} />
      </Container>
    </main>
  );
}
