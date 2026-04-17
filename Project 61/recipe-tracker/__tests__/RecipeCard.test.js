// ============================================================================
// __tests__/RecipeCard.test.js — Unit tests for the RecipeCard component
//
// 🧪 WHAT ARE WE TESTING?
// RecipeCard displays a single recipe and has a "Favorite" button.
// It uses useContext to access favorites data (Step 4).
//
// 🧪 NEW CONCEPT: Testing components that use useContext
// RecipeCard calls useContext(FavoritesContext) — so we MUST wrap it
// in a <FavoritesContext.Provider> in our test, or it won't have data.
//
// This is like how in C#, if a class needs a service via DI, your test
// must provide that service:
//   var service = new Mock<IFavoritesService>();
//   var component = new RecipeCard(service.Object);
//
// In React tests:
//   <FavoritesContext.Provider value={{ favorites: [...], setFavorites: jest.fn() }}>
//     <RecipeCard recipe={...} />
//   </FavoritesContext.Provider>
//
// 🧪 NEW CONCEPT: jest.fn() — mock functions
// jest.fn() creates a "spy" function that records every call.
// We use it for setFavorites so we can verify it was called.
// C# analogy: Mock<Action<List<Favorite>>>() with .Verify()
// ============================================================================

import "isomorphic-fetch";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import allRecipesJson from "../prisma-backend-tools/recipes.json";
import { BASE_URL } from "../utils/api/recipes.js";
import { FavoritesContext } from "../utils/api/FavoritesContext.js";
import RecipeCard from "../components/RecipeCard.js";

// Build a test recipe
const testRecipe = { ...allRecipesJson.recipes[0], id: 1 };
const testRecipe2 = { ...allRecipesJson.recipes[1], id: 2 };

// Mock POST endpoint for favoriting
const server = setupServer(
  http.post(`${BASE_URL}/api/favorites`, () => {
    return HttpResponse.json({
      id: 99,
      recipeId: 1,
      createdAt: "2024-06-01T00:00:00.000Z",
      recipe: testRecipe,
    });
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// ============================================================================
// HELPER: Renders a RecipeCard wrapped in FavoritesContext.Provider
//
// We extract this into a helper because EVERY test needs the context wrapper.
// The helper accepts custom favorites and a mock setter.
//
// In C#, this is like a test fixture / helper method:
//   private RecipeCard CreateCardWithDependencies(List<Favorite> favorites)
//
// Parameters:
//   recipe       — the recipe data to display
//   favorites    — array of existing favorites (to test isFavorited logic)
//   setFavorites — mock function to track state updates
// ============================================================================
function renderRecipeCard(recipe, favorites = [], setFavorites = jest.fn()) {
  return render(
    <FavoritesContext.Provider value={{ favorites, setFavorites }}>
      <RecipeCard recipe={recipe} />
    </FavoritesContext.Provider>
  );
}

// ============================================================================
// TEST 1: Does RecipeCard render the recipe title and info?
// ============================================================================
test("RecipeCard renders recipe title, category, and prep time", () => {
  renderRecipeCard(testRecipe);

  expect(screen.getByText("Classic Pancakes")).toBeInTheDocument();
  expect(screen.getByText("Breakfast")).toBeInTheDocument();
  expect(screen.getByText(/20 min/)).toBeInTheDocument();
});

// ============================================================================
// TEST 2: Does the Favorite button show "☆ Favorite" when NOT favorited?
//
// When favorites array is empty, no recipe is favorited.
// .some() returns false → button shows "☆ Favorite" and is NOT disabled.
// ============================================================================
test("Shows '☆ Favorite' button when recipe is not favorited", () => {
  renderRecipeCard(testRecipe, []); // empty favorites = not favorited

  const button = screen.getByText("☆ Favorite");
  expect(button).toBeInTheDocument();
  expect(button.closest("button")).not.toBeDisabled();
});

// ============================================================================
// TEST 3: Does the Favorite button show "★ Favorited" when already favorited?
//
// When favorites includes this recipe's ID, .some() returns true.
// The button shows "★ Favorited" and is disabled.
//
// We pass favorites with recipeId: 1 to match our testRecipe.id === 1
// ============================================================================
test("Shows '★ Favorited' and disables button when already favorited", () => {
  const existingFavorites = [
    { id: 10, recipeId: 1, createdAt: "2024-01-01", recipe: testRecipe },
  ];

  renderRecipeCard(testRecipe, existingFavorites);

  const button = screen.getByText("★ Favorited");
  expect(button).toBeInTheDocument();
  expect(button.closest("button")).toBeDisabled();
});

// ============================================================================
// TEST 4: Does clicking "☆ Favorite" call setFavorites?
//
// WHAT WE'RE TESTING:
//   - Click "☆ Favorite" → POST fires → setFavorites is called with new array
//
// jest.fn() records all calls made to it.
// toHaveBeenCalled() checks that the function was called at least once.
//
// C# analogy:
//   var mockSetFavorites = new Mock<Action<List<Favorite>>>();
//   button.Click();
//   mockSetFavorites.Verify(f => f(It.IsAny<List<Favorite>>()), Times.Once());
// ============================================================================
test("Clicking Favorite calls setFavorites with the new favorite", async () => {
  const mockSetFavorites = jest.fn();
  renderRecipeCard(testRecipe, [], mockSetFavorites);

  const button = screen.getByText("☆ Favorite");
  fireEvent.click(button);

  // Wait for the async POST to complete and setFavorites to be called
  await waitFor(() => {
    expect(mockSetFavorites).toHaveBeenCalled();
  });

  // Verify the function was called with an array containing the new favorite
  // toHaveBeenCalledWith() checks the exact arguments — like Moq's Verify with It.Is<>()
  const calledWith = mockSetFavorites.mock.calls[0][0]; // first call, first argument
  expect(calledWith.length).toBe(1); // was empty, now has 1
  expect(calledWith[0].recipeId).toBe(1);
});

// ============================================================================
// TEST 5: Does RecipeCard have a "View Details" link to the correct route?
//
// The link should point to /recipe/[id] where id matches the recipe's ID.
// ============================================================================
test("RecipeCard has a View Details link to /recipe/[id]", () => {
  const { container } = renderRecipeCard(testRecipe);

  const link = container.querySelector('a[href="/recipe/1"]');
  expect(link).toBeInTheDocument();
  expect(screen.getByText("View Details")).toBeInTheDocument();
});

// ============================================================================
// TEST 6: Does RecipeCard render as a MUI Card?
//
// Structural test — verifies we're using MUI components, not plain divs.
// ============================================================================
test("RecipeCard renders as a MUI Card component", () => {
  const { container } = renderRecipeCard(testRecipe);

  expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
});

// ============================================================================
// 🎯 BONUS CHALLENGE: Write these RecipeCard tests yourself!
//
// TEST IDEA A: Favoriting a DIFFERENT recipe
//   Render RecipeCard with testRecipe2 (id: 2) but favorites contains
//   only recipeId: 1. Verify the button is NOT disabled (different recipe).
//   Then click Favorite and verify setFavorites is called.
//
// TEST IDEA B: Multiple favorites in context
//   Pass favorites = [{ recipeId: 1 }, { recipeId: 3 }]
//   Render RecipeCard with testRecipe (id: 1)
//   Verify button is disabled (recipe 1 IS in favorites)
//   Then render with a recipe id: 5 and verify button is NOT disabled
//
// TEST IDEA C: Error handling on POST failure
//   Use server.use() to make POST return 500
//   Click Favorite, verify setFavorites was NOT called
//   Hint: expect(mockSetFavorites).not.toHaveBeenCalled()
//   Note: you'll need to wrap the click in try/catch in the component first!
// ============================================================================
