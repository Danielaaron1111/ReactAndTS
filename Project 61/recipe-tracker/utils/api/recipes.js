// utils/api/recipes.js — Fetch helper functions for all API calls
// Think of these like C# service methods that call your Web API endpoints.
// We use async/await here (similar to C#'s async Task<T> pattern).

export const BASE_URL = "http://localhost:3000";

// ============================================================
// GET /api/recipes — Fetch all recipes
// Like calling: await httpClient.GetAsync<List<Recipe>>("/api/recipes")
// ============================================================
export async function getRecipes() {
  const response = await fetch(`${BASE_URL}/api/recipes`);
  const data = await response.json();
  return data;
}

// ============================================================
// GET /api/recipes/[recipeId] — Fetch a single recipe by ID
// Like: await httpClient.GetAsync<Recipe>($"/api/recipes/{id}")
// ============================================================
export async function getRecipeById(recipeId) {
  const response = await fetch(`${BASE_URL}/api/recipes/${recipeId}`);
  const data = await response.json();
  return data;
}

// ============================================================
// GET /api/favorites — Fetch all favorited recipes
// ============================================================
export async function getFavorites() {
  const response = await fetch(`${BASE_URL}/api/favorites`);
  const data = await response.json();
  return data;
}

// ============================================================
// POST /api/favorites — Save a recipe as favorite
// Like: await httpClient.PostAsJsonAsync("/api/favorites", new { recipeId })
// The second argument to fetch() is the "options" object — method, headers, body
// ============================================================
export async function postFavorite(recipeId) {
  const response = await fetch(`${BASE_URL}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipeId }),
  });
  const data = await response.json();
  return data;
}

// ============================================================
// DELETE /api/favorites/[favoriteId] — Remove a favorite
// Like: await httpClient.DeleteAsync($"/api/favorites/{favoriteId}")
// ============================================================
export async function deleteFavorite(favoriteId) {
  const response = await fetch(`${BASE_URL}/api/favorites/${favoriteId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}

// ============================================================
// GET /api/recipes/[recipeId]/reviews — Fetch reviews for a recipe
// ============================================================
export async function getReviews(recipeId) {
  const response = await fetch(`${BASE_URL}/api/recipes/${recipeId}/reviews`);
  const data = await response.json();
  return data;
}

// ============================================================
// POST /api/recipes/[recipeId]/reviews — Submit a new review
// Like: await httpClient.PostAsJsonAsync($"/api/recipes/{id}/reviews", review)
// ============================================================
export async function postReview(recipeId, reviewData) {
  const response = await fetch(`${BASE_URL}/api/recipes/${recipeId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });
  const data = await response.json();
  return data;
}

// ============================================================
// 🎯 BONUS CHALLENGE 7: You'll need a new helper here!
// Create: export async function updateReview(recipeId, reviewId, reviewData)
// It should fetch PUT to: `${BASE_URL}/api/recipes/${recipeId}/reviews/${reviewId}`
// The structure is identical to postReview, just change:
//   - method: "PUT" instead of "POST"
//   - URL includes the reviewId at the end
// You'll also need to create a new API route file:
//   pages/api/recipes/[recipeId]/reviews/[reviewId].js
// In that file, handle method === "PUT", read req.query.reviewId,
// and use prisma.recipeReview.update({ where: { id }, data: { ... } })
// C# analogy: like adding a new [HttpPut] action to your controller
// ============================================================
