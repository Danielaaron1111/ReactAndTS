// ============================================================================
// __tests__/RecipeDetailPage.test.js — Unit tests for the Recipe Detail page
//
// 🧪 WHAT ARE WE TESTING?
// The recipe detail page (pages/recipe/[id].js) does several things:
//   - Reads the recipe ID from the URL using useRouter()
//   - Fetches recipe details and reviews from the API
//   - Displays recipe info, reviews, and a review submission form
//
// 🧪 NEW CONCEPT: Mocking useRouter
// In the real app, useRouter().query.id gives us the URL parameter.
// In tests, there's no real URL/browser, so we MOCK useRouter to return
// whatever query params we want.
//
// jest.mock("next/router") replaces the real module with a fake one.
// C# analogy: like using Mock<IHttpContextAccessor>() to fake route values
//
// 🧪 NEW CONCEPT: Testing forms
// We test that:
//   - Controlled inputs accept user typing (fireEvent.change)
//   - Form submission sends a POST and updates the review list
//   - Required fields are present
// ============================================================================

import "isomorphic-fetch";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import allRecipesJson from "../prisma-backend-tools/recipes.json";
import { BASE_URL } from "../utils/api/recipes.js";

// ============================================================================
// MOCKING useRouter — fake the Next.js router so [id].js can read query.id
//
// jest.mock() replaces the entire "next/router" module with our fake version.
// Every time the component calls useRouter(), it gets our mock return value.
//
// C# analogy:
//   var mockRouter = new Mock<IRouter>();
//   mockRouter.Setup(r => r.Query["id"]).Returns("1");
//   services.AddSingleton(mockRouter.Object);
// ============================================================================
jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { id: "1" }, // Simulate visiting /recipe/1
    push: jest.fn(),     // Mock the push function (not used but prevents errors)
    pathname: "/recipe/[id]",
    isReady: true,
  }),
}));

// Build recipe data with IDs
const recipesWithIds = allRecipesJson.recipes.map((recipe, index) => ({
  ...recipe,
  id: index + 1,
}));

// Mock reviews for recipe 1
const mockReviews = [
  { id: 1, recipeId: 1, reviewerName: "Alice", comment: "Fluffy and delicious!", rating: 5 },
  { id: 2, recipeId: 1, reviewerName: "Bob", comment: "Pretty good, a bit sweet.", rating: 3 },
];

const allEndpoints = [
  // GET /api/recipes/1 — returns the first recipe
  http.get(`${BASE_URL}/api/recipes/1`, () => {
    return HttpResponse.json(recipesWithIds[0]);
  }),

  // GET /api/recipes/1/reviews — returns mock reviews
  http.get(`${BASE_URL}/api/recipes/1/reviews`, () => {
    return HttpResponse.json(mockReviews);
  }),

  // POST /api/recipes/1/reviews — returns the newly created review
  http.post(`${BASE_URL}/api/recipes/1/reviews`, () => {
    return HttpResponse.json({
      id: 99,
      recipeId: 1,
      reviewerName: "TestUser",
      comment: "Great recipe!",
      rating: 4,
    });
  }),
];

const server = setupServer(...allEndpoints);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// ============================================================================
// TEST 1: Does the detail page render the recipe title and info?
//
// WHAT WE'RE TESTING:
//   - useRouter provides id=1
//   - useEffect fetches recipe #1 from the mock API
//   - The recipe title, category, prep time, ingredients, and instructions render
//
// screen.getByText("Classic Pancakes") will THROW if the text isn't found,
// which automatically fails the test — no need for a separate assertion!
// But we add .toBeInTheDocument() for clarity and readability.
// ============================================================================
test("Recipe detail page renders recipe title and information", async () => {
  render(<RecipeDetail />);

  await waitFor(() => {
    expect(screen.getByText("Classic Pancakes")).toBeInTheDocument();
  });

  // Check that category and prep time appear (rendered as MUI Chips)
  expect(screen.getByText("Breakfast")).toBeInTheDocument();
  expect(screen.getByText(/20 min/)).toBeInTheDocument();

  // Check sections exist
  expect(screen.getByText("Ingredients")).toBeInTheDocument();
  expect(screen.getByText("Instructions")).toBeInTheDocument();
});

// Need to import RecipeDetail AFTER the mock is set up
// This is because the mock must be in place before the module loads
import RecipeDetail from "../pages/recipe/[id].js";

// ============================================================================
// TEST 2: Does the detail page render existing reviews?
//
// WHAT WE'RE TESTING:
//   - The mock API returns 2 reviews for recipe 1
//   - Both reviewer names and comments appear in the DOM
//   - The review count header shows the correct number
// ============================================================================
test("Recipe detail page renders existing reviews", async () => {
  render(<RecipeDetail />);

  await waitFor(() => {
    // Check that both reviewers' names appear
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  // Check that review comments are displayed
  expect(screen.getByText("Fluffy and delicious!")).toBeInTheDocument();
  expect(screen.getByText("Pretty good, a bit sweet.")).toBeInTheDocument();

  // Check the review count header
  expect(screen.getByText("Reviews (2)")).toBeInTheDocument();
});

// ============================================================================
// TEST 3: Does the review form have all required inputs?
//
// WHAT WE'RE TESTING:
//   - The form renders with a name field, comment field, rating select, and submit button
//   - These are the controlled inputs from Step 6
//
// screen.getByLabelText() finds inputs by their <label> text
// This is the PREFERRED way to find form inputs in testing-library
// because it mimics how a real user finds inputs — by reading the label.
// C# equivalent: form.FindByLabel("Your Name")
// ============================================================================
test("Review form renders with all required inputs", async () => {
  render(<RecipeDetail />);

  await waitFor(() => {
    expect(screen.getByText("Classic Pancakes")).toBeInTheDocument();
  });

  // Find form inputs by their labels (regex because MUI adds " *" to required labels)
  expect(screen.getByLabelText(/Your Name/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Your Review/)).toBeInTheDocument();
  // MUI Select doesn't use standard label-for association, so use getAllByText
  // (MUI renders "Rating" in both the label and the fieldset legend)
  expect(screen.getAllByText("Rating").length).toBeGreaterThanOrEqual(1);

  // Find the submit button by its text
  expect(screen.getByText("Submit Review")).toBeInTheDocument();
});

// ============================================================================
// TEST 4: Can the user type into the review form inputs?
//
// WHAT WE'RE TESTING:
//   - Controlled inputs update when the user types (fireEvent.change)
//   - The input's value reflects what was typed
//
// This verifies that useState + onChange are wired up correctly.
// If the controlled input pattern is broken, the input won't update.
//
// .toHaveValue() checks the current value of an input element
// C# equivalent: Assert.AreEqual("Dan", textBox.Text);
// ============================================================================
test("Review form inputs accept user typing", async () => {
  render(<RecipeDetail />);

  await waitFor(() => {
    expect(screen.getByText("Classic Pancakes")).toBeInTheDocument();
  });

  // Type into the name field
  const nameInput = screen.getByLabelText(/Your Name/);
  fireEvent.change(nameInput, { target: { value: "Dan" } });
  expect(nameInput).toHaveValue("Dan");

  // Type into the comment field
  const commentInput = screen.getByLabelText(/Your Review/);
  fireEvent.change(commentInput, { target: { value: "Amazing recipe!" } });
  expect(commentInput).toHaveValue("Amazing recipe!");
});

// ============================================================================
// TEST 5: Does submitting the form add a new review to the list?
//
// WHAT WE'RE TESTING:
//   - Fill out the form → click Submit → POST fires → new review appears
//   - The review count updates from 2 to 3
//   - The form fields reset to empty after successful submission
//
// fireEvent.submit() triggers the form's onSubmit handler
// (which calls e.preventDefault() and then POSTs to the API)
//
// This is the most complex test — it tests the full cycle:
//   user input → form submit → API call → state update → UI re-render
// ============================================================================
test("Submitting a review adds it to the review list", async () => {
  render(<RecipeDetail />);

  // Wait for page to load
  await waitFor(() => {
    expect(screen.getByText("Reviews (2)")).toBeInTheDocument();
  });

  // Fill out the form
  const nameInput = screen.getByLabelText(/Your Name/);
  const commentInput = screen.getByLabelText(/Your Review/);

  fireEvent.change(nameInput, { target: { value: "TestUser" } });
  fireEvent.change(commentInput, { target: { value: "Great recipe!" } });

  // Submit the form by clicking the submit button
  const submitButton = screen.getByText("Submit Review");
  fireEvent.click(submitButton);

  // After submission, the new review should appear in the list
  // The mock POST returns { reviewerName: "TestUser", comment: "Great recipe!" }
  await waitFor(() => {
    expect(screen.getByText("TestUser")).toBeInTheDocument();
    expect(screen.getByText("Great recipe!")).toBeInTheDocument();
    // Review count should update from 2 to 3
    expect(screen.getByText("Reviews (3)")).toBeInTheDocument();
  });
});

// ============================================================================
// TEST 6: Does the loading spinner appear on initial render?
// ============================================================================
test("Loading spinner appears before recipe data loads", () => {
  render(<RecipeDetail />);
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});

// ============================================================================
// 🎯 BONUS CHALLENGE: Write these Recipe Detail tests yourself!
//
// TEST IDEA A: Average rating display (Challenge 5)
//   After implementing the average rating, test that:
//   - The average of [5, 3] = "4.0" appears on screen
//   Hint: screen.getByText(/4\.0/) or screen.getByText(/Average/)
//
// TEST IDEA B: Edit a review (Challenge 7)
//   After implementing edit, test that:
//   - Clicking "Edit" shows an edit form
//   - Submitting the edit updates the review text
//   Hint: you'll need to add a PUT mock endpoint and use fireEvent.click
//   on the Edit button, then fill the form and submit
//
// TEST IDEA C: Error handling
//   Use server.use() to make GET /api/recipes/1 return a 500 error.
//   Verify that the error message appears instead of the recipe.
//   Hint: return HttpResponse.json({ error: "fail" }, { status: 500 })
//   But also: your fetch helper doesn't throw on non-200! You might
//   need to add if (!response.ok) throw new Error() to recipes.js first.
//
// TEST IDEA D: Form validation
//   Try submitting the form with empty fields. Verify that:
//   - The review is NOT added (still 2 reviews)
//   - The required attribute prevents submission
//   Hint: HTML5 required validation might not fire in jsdom.
//   You may need to add manual validation in handleSubmit.
// ============================================================================
