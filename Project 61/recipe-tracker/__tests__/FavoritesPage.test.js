// ============================================================================
// __tests__/FavoritesPage.test.js — Unit tests for the Favorites page
//
// 🧪 WHAT ARE WE TESTING?
// The Favorites page (pages/favorites.js) fetches saved favorites from the API
// and lets the user remove them with a DELETE request.
//
// 🧪 TESTING STRATEGY:
// We mock the GET /api/favorites endpoint to return pre-saved favorites,
// and mock DELETE /api/favorites/[id] to simulate removal.
// Then we test that:
//   1. Favorites load and display correctly
//   2. The "Remove" button removes a favorite from the list
//   3. An empty state message shows when there are no favorites
//
// 🧪 NEW CONCEPT: server.use() — override a handler for a SINGLE test
// Sometimes you want one test to return different data than the default.
// server.use() temporarily replaces a handler. afterEach(server.resetHandlers)
// cleans it up so the next test gets the default handlers again.
// C# analogy: like calling mock.Setup() differently in individual test methods
// ============================================================================

import "isomorphic-fetch";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import allRecipesJson from "../prisma-backend-tools/recipes.json";
import { BASE_URL } from "../utils/api/recipes.js";

import FavoritesPage from "../pages/favorites.js";

// Build recipe data with IDs
const recipesWithIds = allRecipesJson.recipes.map((recipe, index) => ({
  ...recipe,
  id: index + 1,
}));

// Mock favorites — simulate 2 saved favorites (recipe 1 and recipe 3)
const mockFavorites = [
  { id: 10, recipeId: 1, createdAt: "2024-01-01T00:00:00.000Z", recipe: recipesWithIds[0] },
  { id: 11, recipeId: 3, createdAt: "2024-01-02T00:00:00.000Z", recipe: recipesWithIds[2] },
];

const allEndpoints = [
  // GET /api/favorites — returns our mock favorites
  http.get(`${BASE_URL}/api/favorites`, () => {
    return HttpResponse.json(mockFavorites);
  }),

  // DELETE /api/favorites/:id — simulates successful deletion
  // The :favoriteId in the URL is a path parameter
  http.delete(`${BASE_URL}/api/favorites/:favoriteId`, () => {
    return HttpResponse.json({ message: "Favorite removed successfully" });
  }),
];

const server = setupServer(...allEndpoints);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers()); // Reset overrides between tests

// ============================================================================
// TEST 1: Does the Favorites page render all saved favorites?
//
// WHAT WE'RE TESTING:
//   - useEffect fetches favorites on mount
//   - Each favorite renders as a MUI Card
//   - The recipe title is visible inside each card
//
// We check for 2 cards because our mock returns 2 favorites.
// ============================================================================
test("Favorites page renders all saved favorite recipes", async () => {
  const { container } = render(<FavoritesPage />);

  await waitFor(() => {
    const cards = container.querySelectorAll(".MuiCard-root");
    expect(cards.length).toBe(2);
  });

  // Verify the actual recipe titles are displayed
  // getByText throws if the text isn't found — which would fail the test
  expect(screen.getByText("Classic Pancakes")).toBeInTheDocument();
  expect(screen.getByText("Spaghetti Bolognese")).toBeInTheDocument();
});

// ============================================================================
// TEST 2: Does clicking "Remove" delete a favorite from the list?
//
// WHAT WE'RE TESTING:
//   - Clicking "Remove" sends a DELETE request
//   - After deletion, the card disappears from the DOM
//   - State updates via .filter() to exclude the removed item
//
// This tests the full flow: click → DELETE fetch → .filter() state update → re-render
//
// waitFor() is essential here because the DELETE is async.
// The UI won't update until the fetch completes and setFavorites() is called.
// ============================================================================
test("Clicking Remove deletes a favorite and removes it from the list", async () => {
  const { container } = render(<FavoritesPage />);

  // Wait for initial load
  await waitFor(() => {
    expect(container.querySelectorAll(".MuiCard-root").length).toBe(2);
  });

  // Find all Remove buttons and click the first one
  const removeButtons = screen.getAllByText("Remove");
  expect(removeButtons.length).toBe(2);

  fireEvent.click(removeButtons[0]);

  // After removal, only 1 card should remain
  await waitFor(() => {
    expect(container.querySelectorAll(".MuiCard-root").length).toBe(1);
  });
});

// ============================================================================
// TEST 3: Does the empty state message appear when there are no favorites?
//
// WHAT WE'RE TESTING:
//   - When the API returns an empty array, a helpful message shows
//   - No cards are rendered
//
// 🧪 NEW CONCEPT: server.use() to override a mock for ONE test
// We override GET /api/favorites to return [] (empty) for JUST this test.
// afterEach(server.resetHandlers) will restore the default after this test.
//
// C# analogy:
//   mock.Setup(s => s.GetFavorites()).Returns(new List<Favorite>());
//   // This setup only applies to this test method
// ============================================================================
test("Shows empty message when there are no favorites", async () => {
  // Override the favorites endpoint to return empty array — JUST for this test
  server.use(
    http.get(`${BASE_URL}/api/favorites`, () => {
      return HttpResponse.json([]);
    })
  );

  const { container } = render(<FavoritesPage />);

  await waitFor(() => {
    // No cards should be rendered
    expect(container.querySelectorAll(".MuiCard-root").length).toBe(0);
    // The empty state message should be visible
    expect(screen.getByText(/haven't saved any favorites/i)).toBeInTheDocument();
  });
});

// ============================================================================
// TEST 4: Does the loading spinner appear before favorites load?
//
// Same pattern as the Home page spinner test.
// We check the INITIAL render (before useEffect completes).
// ============================================================================
test("Loading spinner appears before favorites load", () => {
  render(<FavoritesPage />);
  const spinner = screen.getByRole("progressbar");
  expect(spinner).toBeInTheDocument();
});

// ============================================================================
// TEST 5: Does each favorite card have a "View Details" link?
//
// WHAT WE'RE TESTING:
//   - Each card has a link to the recipe detail page
//   - The link points to the correct route (/recipe/[id])
//
// getAllByText() returns all matching elements as an array
// C# equivalent: component.FindAll("a").Where(a => a.TextContent == "View Details")
// ============================================================================
test("Each favorite card has a View Details link", async () => {
  render(<FavoritesPage />);

  await waitFor(() => {
    const viewDetailsLinks = screen.getAllByText("View Details");
    expect(viewDetailsLinks.length).toBe(2);
  });
});

// ============================================================================
// 🎯 BONUS CHALLENGE: Write these Favorites page tests yourself!
//
// TEST IDEA A: Confirm before remove (Challenge 4)
//   After implementing window.confirm(), test that:
//   - If the user clicks "Cancel" in the confirm dialog, the card stays
//   Hint: mock window.confirm to return false:
//     window.confirm = jest.fn(() => false);
//   Then click Remove and verify the card count is STILL 2
//   Don't forget to restore it: window.confirm = jest.fn(() => true);
//
// TEST IDEA B: Multiple removes
//   Click Remove on BOTH favorites, one after another.
//   Verify the empty state message appears after the second removal.
//   Hint: you'll need two waitFor() blocks — one after each click
//
// TEST IDEA C: Error handling
//   Use server.use() to make DELETE return a 500 error:
//     http.delete(`${BASE_URL}/api/favorites/:id`, () => {
//       return HttpResponse.json({ error: "fail" }, { status: 500 });
//     })
//   Verify the card is NOT removed (still 2 cards after click)
// ============================================================================
