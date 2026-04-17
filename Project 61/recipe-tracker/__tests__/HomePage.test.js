// ============================================================================
// __tests__/HomePage.test.js — Unit tests for the Home page (pages/index.js)
//
// 🧪 WHAT IS UNIT TESTING?
// Unit testing means testing small pieces of your app in isolation.
// In C#, you'd write [TestMethod] or [Fact] methods with Assert.AreEqual().
// In React/Jest, we write test() blocks with expect() assertions.
//
// 🧪 WHAT IS MSW (Mock Service Worker)?
// Our components call fetch() to get data from /api/recipes. But in tests,
// there's no real server running! MSW intercepts those fetch calls and
// returns fake (mock) data — like Moq in C# but for HTTP requests.
//
// 🧪 WHAT IS @testing-library/react?
// It provides render() to mount React components and screen/queries to
// find elements in the rendered output. Think of it as:
//   C# equivalent: rendering a UserControl in a test harness and using
//   FindName("myButton") to locate elements.
//
// 🧪 KEY TESTING CONCEPTS USED HERE:
// - render()     → mounts a component into a virtual DOM (like instantiating a UserControl)
// - screen       → queries the rendered output (like FindVisualChild in WPF)
// - waitFor()    → waits for async operations to complete (like await in C# tests)
// - fireEvent    → simulates user actions like clicks (like ButtonAutomationPeer.Invoke())
// - expect()     → makes assertions (like Assert.AreEqual / Assert.IsTrue in C#)
// - jest.fn()    → creates a mock function (like Mock<IService>().Setup() in Moq)
// ============================================================================

import "isomorphic-fetch"; // Polyfill: provides global fetch() in the test environment
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Adds matchers like .toBeInTheDocument(), .toBeDisabled()

// MSW (Mock Service Worker) — intercepts HTTP requests in tests
// http: defines which HTTP method + URL to intercept
// HttpResponse: creates the fake response to return
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node"; // Node.js version (not browser)

// Import the seed data so our mock API returns realistic data
import allRecipesJson from "../prisma-backend-tools/recipes.json";

// Import the BASE_URL so our mock endpoints match the real ones
import { BASE_URL } from "../utils/api/recipes.js";

// Import the component we're testing
import Home from "../pages/index.js";

// ============================================================================
// MOCK SERVER SETUP
//
// This is like setting up a fake Web API in C# tests using WebApplicationFactory
// or a mock HttpClient. We define what each endpoint should return.
//
// The pattern is: http.get(URL, handlerFunction)
// The handler returns HttpResponse.json(data) — like Ok(data) in C# controllers
// ============================================================================

// Add IDs to the seed data (the JSON file doesn't have them, but the API would)
const recipesWithIds = allRecipesJson.recipes.map((recipe, index) => ({
  ...recipe,
  id: index + 1,
}));

// Define mock API endpoints — these intercept real fetch() calls during tests
const allEndpoints = [
  // Mock GET /api/recipes — returns all recipes with IDs
  http.get(`${BASE_URL}/api/recipes`, () => {
    return HttpResponse.json(recipesWithIds);
  }),

  // Mock GET /api/favorites — returns 2 pre-saved favorites
  // We simulate that recipes 1 and 3 are already favorited
  http.get(`${BASE_URL}/api/favorites`, () => {
    return HttpResponse.json([
      { id: 1, recipeId: 1, createdAt: "2024-01-01T00:00:00.000Z", recipe: recipesWithIds[0] },
      { id: 2, recipeId: 3, createdAt: "2024-01-01T00:00:00.000Z", recipe: recipesWithIds[2] },
    ]);
  }),

  // Mock POST /api/favorites — returns a new favorite object
  // This is called when the user clicks the "Favorite" button
  http.post(`${BASE_URL}/api/favorites`, () => {
    return HttpResponse.json({
      id: 99,
      recipeId: 2,
      createdAt: "2024-06-01T00:00:00.000Z",
      recipe: recipesWithIds[1],
    });
  }),
];

// setupServer() creates a mock server that intercepts network requests
// The spread operator (...) passes all our endpoint handlers
const server = setupServer(...allEndpoints);

// ============================================================================
// LIFECYCLE HOOKS — like [TestInitialize] and [TestCleanup] in C# MSTest
//
// beforeAll: runs ONCE before all tests in this file (start mock server)
// afterAll:  runs ONCE after all tests (stop mock server)
// afterEach: runs after EACH test (reset any per-test overrides)
//
// C# equivalent:
//   [ClassInitialize] public static void Setup() { server.Start(); }
//   [ClassCleanup]    public static void Teardown() { server.Stop(); }
// ============================================================================
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// ============================================================================
// TEST 1: Does the Home page render all recipe cards from the API?
//
// WHAT WE'RE TESTING:
//   - useEffect fires and fetches data from /api/recipes
//   - The loading spinner goes away
//   - All 6 recipe cards appear in the DOM
//
// TESTING PATTERN: "render → wait → assert"
//   1. render(<Home />) — mount the component
//   2. waitFor(() => ...) — wait for async useEffect to finish
//   3. expect(...) — check that the expected elements exist
//
// C# equivalent test:
//   [Fact] public async Task Home_Should_RenderAllRecipeCards()
//   {
//       var component = RenderComponent<Home>();
//       await Task.Delay(100); // wait for data load
//       var cards = component.FindAll(".MuiCard-root");
//       Assert.True(cards.Count >= 6);
//   }
// ============================================================================
test("Home page renders all recipe cards from the API", async () => {
  // render() mounts the <Home /> component into a virtual DOM
  // { container } gives us raw DOM access (like document.querySelector)
  const { container } = render(<Home />);

  // waitFor() keeps retrying the callback until it passes or times out
  // This is necessary because useEffect + fetch is asynchronous
  // Without waitFor, the test would check BEFORE the data loads and fail
  await waitFor(() => {
    // querySelectorAll finds all MUI Card components in the rendered output
    // MUI renders Cards with the CSS class "MuiCard-root"
    const cards = container.querySelectorAll(".MuiCard-root");
    expect(cards.length).toBe(6); // We seeded 6 recipes
  });
});

// ============================================================================
// TEST 2: Does the search filter actually filter recipes by title?
//
// WHAT WE'RE TESTING:
//   - Typing in the search box filters the displayed recipe cards
//   - Only matching recipes remain visible
//
// TESTING PATTERN: "render → wait for load → interact → assert"
//
// fireEvent.change() simulates the user typing into an input
// It's like automating keyboard input in a C# UI test:
//   C#: inputElement.SendKeys("pancake");
//   JS: fireEvent.change(input, { target: { value: "Pancake" } });
// ============================================================================
test("Search filter reduces the displayed recipe cards", async () => {
  const { container } = render(<Home />);

  // Wait for recipes to load first
  await waitFor(() => {
    const cards = container.querySelectorAll(".MuiCard-root");
    expect(cards.length).toBe(6);
  });

  // Find the search input — MUI TextField renders an <input> inside
  // In C#: var searchBox = component.Find("input[type='text']");
  const searchInput = container.querySelector("input");

  // Simulate the user typing "Pancake" into the search box
  // fireEvent.change triggers the onChange handler, which calls setSearchTerm("Pancake")
  // This causes a re-render, and .filter() excludes non-matching recipes
  fireEvent.change(searchInput, { target: { value: "Pancake" } });

  // After filtering, only "Classic Pancakes" should remain (1 card)
  await waitFor(() => {
    const cards = container.querySelectorAll(".MuiCard-root");
    expect(cards.length).toBe(1);
  });
});

// ============================================================================
// TEST 3: Does the search show "no results" for a nonsense query?
//
// WHAT WE'RE TESTING:
//   - When the search finds nothing, a "No recipes found" message appears
//   - Zero cards are rendered
//
// screen.getByText() finds an element by its visible text content
// The /regex/i syntax means case-insensitive match
// C# equivalent: Assert.Contains("No recipes found", component.Markup);
// ============================================================================
test("Search with no matches shows 'No recipes found' message", async () => {
  const { container } = render(<Home />);

  await waitFor(() => {
    expect(container.querySelectorAll(".MuiCard-root").length).toBe(6);
  });

  const searchInput = container.querySelector("input");
  fireEvent.change(searchInput, { target: { value: "xyznonexistent" } });

  await waitFor(() => {
    // No cards should be rendered
    expect(container.querySelectorAll(".MuiCard-root").length).toBe(0);
    // The "no recipes found" message should be visible
    expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
  });
});

// ============================================================================
// TEST 4: Are already-favorited recipes marked as disabled on load?
//
// WHAT WE'RE TESTING:
//   - When the page loads, recipes that are already favorited have a disabled button
//   - The button text shows "★ Favorited" instead of "☆ Favorite"
//
// .toBeDisabled() checks the HTML disabled attribute
// C# equivalent: Assert.False(button.IsEnabled);
//
// We use getAllByText() which returns an array of ALL matching elements
// (there could be multiple favorited recipes)
// ============================================================================
test("Already-favorited recipes have disabled Favorite buttons", async () => {
  render(<Home />);

  await waitFor(() => {
    // Our mock API says recipes 1 and 3 are favorited
    // So there should be exactly 2 buttons with "★ Favorited" text
    const favoritedButtons = screen.getAllByText("★ Favorited");
    expect(favoritedButtons.length).toBe(2);

    // Each of these buttons should be disabled (can't double-favorite)
    favoritedButtons.forEach((button) => {
      expect(button.closest("button")).toBeDisabled();
    });
  });
});

// ============================================================================
// TEST 5: Can the user favorite a non-favorited recipe?
//
// WHAT WE'RE TESTING:
//   - Clicking "☆ Favorite" on an unfavorited recipe sends a POST request
//   - After clicking, the button changes to "★ Favorited" and becomes disabled
//
// This tests the full flow: click → POST fetch → state update → re-render
//
// fireEvent.click() simulates a mouse click
// C# equivalent: ButtonAutomationPeer.Invoke() or button.RaiseEvent(clickEvent)
// ============================================================================
test("Clicking Favorite button on an unfavorited recipe disables it", async () => {
  render(<Home />);

  await waitFor(() => {
    // Find all the "☆ Favorite" buttons (unfavorited ones)
    const favoriteButtons = screen.getAllByText("☆ Favorite");
    // Our mock has 6 recipes, 2 already favorited → 4 unfavorited buttons
    expect(favoriteButtons.length).toBe(4);
  });

  // Click the first unfavorited button
  const favoriteButtons = screen.getAllByText("☆ Favorite");
  fireEvent.click(favoriteButtons[0]);

  // After clicking, that button should change to "★ Favorited" and be disabled
  // The mock POST returns a new favorite, which gets added to state
  await waitFor(() => {
    // Now there should be 3 favorited buttons (was 2, clicked 1 more)
    const favoritedButtons = screen.getAllByText("★ Favorited");
    expect(favoritedButtons.length).toBe(3);
  });
});

// ============================================================================
// TEST 6: Does the loading spinner appear before data loads?
//
// WHAT WE'RE TESTING:
//   - The CircularProgress spinner shows while useEffect is fetching
//   - It disappears once the data loads
//
// The MUI CircularProgress renders with role="progressbar"
// screen.queryByRole() returns null if not found (doesn't throw)
// screen.getByRole() throws if not found — use when you EXPECT it to be there
//
// C# equivalent: Assert.IsNotNull(component.FindByRole("progressbar"));
// ============================================================================
test("Loading spinner appears initially", () => {
  // We render without awaiting — check the INITIAL render before useEffect completes
  render(<Home />);

  // The spinner should be there right away (loading = true initially)
  const spinner = screen.getByRole("progressbar");
  expect(spinner).toBeInTheDocument();
});

// ============================================================================
// 🎯 BONUS CHALLENGE: Write these additional Home page tests yourself!
//
// TEST IDEA A: Category filter
//   After you implement Challenge 1 (category dropdown), test that:
//   - Selecting "Breakfast" shows only breakfast recipes (2 in our seed data)
//   - Selecting "All" shows all recipes again
//   Hint: fireEvent.change() works on <Select> the same way as <TextField>
//   You'll need to target the Select's underlying <input> element
//
// TEST IDEA B: Pagination
//   After you implement Challenge 8, test that:
//   - Only 3 cards show on page 1
//   - Clicking "Next" shows the next batch
//   - "Previous" button is disabled on page 1
//   Hint: use fireEvent.click() on the Next button, then count cards again
//
// TEST IDEA C: Loading skeleton
//   After you implement Challenge 3, test that:
//   - Skeleton elements appear during loading instead of the spinner
//   - MUI Skeleton renders with class "MuiSkeleton-root"
//   Hint: container.querySelectorAll(".MuiSkeleton-root")
// ============================================================================
