// ============================================================================
// __tests__/FetchHelpers.test.js — Unit tests for utils/api/recipes.js
//
// 🧪 WHAT ARE WE TESTING?
// The fetch helper functions in utils/api/recipes.js — these are "service"
// functions that wrap fetch() calls. They're the bridge between your React
// components and the API.
//
// 🧪 WHY TEST FETCH HELPERS SEPARATELY?
// If a component test fails, is it the component's fault or the fetch helper's?
// Testing fetch helpers in isolation tells you the API layer works correctly.
// Then if a component test fails, you know the bug is in the component.
//
// C# analogy: testing your service layer independently from your controllers:
//   [Fact] public async Task GetRecipes_Should_ReturnAllRecipes()
//   {
//       var service = new RecipeService(mockHttpClient.Object);
//       var result = await service.GetRecipes();
//       Assert.Equal(6, result.Count);
//   }
//
// 🧪 PATTERN: We mock the same endpoints but test the FUNCTIONS, not the UI.
// No render() here — just calling the function and checking the return value.
// ============================================================================

import "isomorphic-fetch";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import allRecipesJson from "../prisma-backend-tools/recipes.json";

// Import ALL the fetch helpers we want to test
import {
  BASE_URL,
  getRecipes,
  getRecipeById,
  getFavorites,
  postFavorite,
  deleteFavorite,
  getReviews,
  postReview,
} from "../utils/api/recipes.js";

// Build test data
const recipesWithIds = allRecipesJson.recipes.map((recipe, index) => ({
  ...recipe,
  id: index + 1,
}));

const mockFavorites = [
  { id: 1, recipeId: 1, recipe: recipesWithIds[0] },
  { id: 2, recipeId: 3, recipe: recipesWithIds[2] },
];

const mockReviews = [
  { id: 1, recipeId: 1, reviewerName: "Alice", comment: "Great!", rating: 5 },
];

// Set up mock endpoints for ALL API routes
const server = setupServer(
  http.get(`${BASE_URL}/api/recipes`, () => {
    return HttpResponse.json(recipesWithIds);
  }),
  http.get(`${BASE_URL}/api/recipes/1`, () => {
    return HttpResponse.json(recipesWithIds[0]);
  }),
  http.get(`${BASE_URL}/api/favorites`, () => {
    return HttpResponse.json(mockFavorites);
  }),
  http.post(`${BASE_URL}/api/favorites`, () => {
    return HttpResponse.json({ id: 99, recipeId: 2, recipe: recipesWithIds[1] });
  }),
  http.delete(`${BASE_URL}/api/favorites/1`, () => {
    return HttpResponse.json({ message: "Removed" });
  }),
  http.get(`${BASE_URL}/api/recipes/1/reviews`, () => {
    return HttpResponse.json(mockReviews);
  }),
  http.post(`${BASE_URL}/api/recipes/1/reviews`, () => {
    return HttpResponse.json({ id: 10, recipeId: 1, reviewerName: "Test", comment: "Nice", rating: 4 });
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// ============================================================================
// TEST 1: getRecipes() returns all recipes
//
// This is a pure function test — no UI, just call and check the return.
// In C#: var result = await service.GetRecipes(); Assert.Equal(6, result.Count);
// ============================================================================
test("getRecipes() returns all 6 recipes", async () => {
  const recipes = await getRecipes();

  expect(recipes.length).toBe(6);
  expect(recipes[0].title).toBe("Classic Pancakes");
  expect(recipes[5].title).toBe("Grilled Chicken Tacos");
});

// ============================================================================
// TEST 2: getRecipeById() returns the correct recipe
// ============================================================================
test("getRecipeById(1) returns the first recipe", async () => {
  const recipe = await getRecipeById(1);

  expect(recipe.id).toBe(1);
  expect(recipe.title).toBe("Classic Pancakes");
  expect(recipe.category).toBe("Breakfast");
});

// ============================================================================
// TEST 3: getFavorites() returns favorites with recipe data
// ============================================================================
test("getFavorites() returns favorites with included recipe objects", async () => {
  const favorites = await getFavorites();

  expect(favorites.length).toBe(2);
  expect(favorites[0].recipeId).toBe(1);
  expect(favorites[0].recipe.title).toBe("Classic Pancakes");
});

// ============================================================================
// TEST 4: postFavorite() returns the new favorite object
//
// We test that the function correctly:
//   1. Sends a POST request
//   2. Returns the parsed JSON response
//
// We're NOT testing that the database was updated (that's an integration test).
// We're testing that our fetch wrapper correctly sends and receives data.
// ============================================================================
test("postFavorite() returns the newly created favorite", async () => {
  const newFav = await postFavorite(2);

  expect(newFav.id).toBe(99);
  expect(newFav.recipeId).toBe(2);
  expect(newFav.recipe.title).toBe("Caesar Salad");
});

// ============================================================================
// TEST 5: deleteFavorite() returns a success message
// ============================================================================
test("deleteFavorite() returns success message", async () => {
  const result = await deleteFavorite(1);

  expect(result.message).toBe("Removed");
});

// ============================================================================
// TEST 6: getReviews() returns reviews for a specific recipe
// ============================================================================
test("getReviews(1) returns reviews for recipe 1", async () => {
  const reviews = await getReviews(1);

  expect(reviews.length).toBe(1);
  expect(reviews[0].reviewerName).toBe("Alice");
  expect(reviews[0].rating).toBe(5);
});

// ============================================================================
// TEST 7: postReview() returns the new review
// ============================================================================
test("postReview() returns the newly created review", async () => {
  const newReview = await postReview(1, {
    reviewerName: "Test",
    comment: "Nice",
    rating: 4,
  });

  expect(newReview.id).toBe(10);
  expect(newReview.reviewerName).toBe("Test");
  expect(newReview.rating).toBe(4);
});

// ============================================================================
// 🎯 BONUS CHALLENGE: Write these fetch helper tests yourself!
//
// TEST IDEA A: updateReview (Challenge 7)
//   After creating the updateReview() helper, test that:
//   - It sends a PUT request with the correct body
//   - It returns the updated review object
//   Hint: add a http.put() mock endpoint and test the function
//
// TEST IDEA B: Error responses
//   What happens when the API returns a 404 or 500?
//   Currently, the helpers don't throw — they just return the error JSON.
//   Test: const result = await getRecipeById(999);
//   With a mock that returns 404, verify result contains { error: "..." }
//
// TEST IDEA C: Network failure
//   What if fetch() itself throws (network down)?
//   Use server.use() with http.get(..., () => { return HttpResponse.error() })
//   Wrap your function call in a try/catch and verify it throws.
//   Currently the helpers don't handle network errors — you'd need to add
//   if (!response.ok) throw new Error() to each helper first!
// ============================================================================
