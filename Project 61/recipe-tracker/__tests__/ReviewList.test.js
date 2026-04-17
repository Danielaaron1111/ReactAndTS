// ============================================================================
// __tests__/ReviewList.test.js — Unit tests for the ReviewList component
//
// 🧪 WHAT ARE WE TESTING?
// ReviewList is a "presentational" component — it just receives data via props
// and renders it. No state, no side effects, no fetching.
//
// These are the easiest components to test because:
//   - No mocking needed (no API calls)
//   - No context needed (no useContext)
//   - Just pass props and check the output
//
// In C#, this is like testing a read-only UserControl:
//   var control = new ReviewList(reviews);
//   Assert.Contains("Alice", control.Render());
//
// 🧪 TESTING PATTERN FOR PRESENTATIONAL COMPONENTS:
//   1. Define test data (an array of reviews)
//   2. render(<ReviewList reviews={testData} />)
//   3. Check that the expected text appears
//
// This is the "Given → When → Then" pattern:
//   Given: a list of 2 reviews
//   When: the component renders
//   Then: both reviewer names and comments are visible
// ============================================================================

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ReviewList from "../components/ReviewList.js";

// Test data — define it outside tests so multiple tests can reuse it
// In C#, this would be a [ClassData] or a test fixture
const testReviews = [
  { id: 1, recipeId: 1, reviewerName: "Alice", comment: "Delicious!", rating: 5 },
  { id: 2, recipeId: 1, reviewerName: "Bob", comment: "Not bad.", rating: 3 },
  { id: 3, recipeId: 1, reviewerName: "Carol", comment: "My favorite!", rating: 4 },
];

// ============================================================================
// TEST 1: Does ReviewList render all review names and comments?
//
// We pass 3 reviews and check that each reviewer's name appears.
// getByText() throws if not found — which auto-fails the test.
// ============================================================================
test("ReviewList renders all reviewer names", () => {
  render(<ReviewList reviews={testReviews} />);

  expect(screen.getByText("Alice")).toBeInTheDocument();
  expect(screen.getByText("Bob")).toBeInTheDocument();
  expect(screen.getByText("Carol")).toBeInTheDocument();
});

// ============================================================================
// TEST 2: Does ReviewList render review comments?
// ============================================================================
test("ReviewList renders all review comments", () => {
  render(<ReviewList reviews={testReviews} />);

  expect(screen.getByText("Delicious!")).toBeInTheDocument();
  expect(screen.getByText("Not bad.")).toBeInTheDocument();
  expect(screen.getByText("My favorite!")).toBeInTheDocument();
});

// ============================================================================
// TEST 3: Does ReviewList show the correct count?
//
// The component renders "Reviews (3)" as a heading.
// ============================================================================
test("ReviewList shows the correct review count", () => {
  render(<ReviewList reviews={testReviews} />);

  expect(screen.getByText("Reviews (3)")).toBeInTheDocument();
});

// ============================================================================
// TEST 4: Does ReviewList show an empty message when there are no reviews?
//
// Edge case testing! What happens with an empty array?
// The component should show "No reviews yet." instead of an empty list.
//
// Testing edge cases is important — it catches bugs like:
//   - "Cannot read property 'length' of undefined"
//   - Showing "Reviews (0)" with an empty container
//
// C# analogy: [Fact] public void ReviewList_EmptyList_ShowsMessage()
// ============================================================================
test("ReviewList shows empty message when reviews array is empty", () => {
  render(<ReviewList reviews={[]} />);

  expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
});

// ============================================================================
// TEST 5: Does ReviewList render the correct number of MUI Cards?
//
// Each review should be its own Card component.
// We count the rendered cards and compare to input length.
// ============================================================================
test("ReviewList renders one MUI Card per review", () => {
  const { container } = render(<ReviewList reviews={testReviews} />);

  const cards = container.querySelectorAll(".MuiCard-root");
  expect(cards.length).toBe(3);
});

// ============================================================================
// TEST 6: Does ReviewList render with a single review?
//
// Another edge case — testing with exactly 1 item.
// Makes sure the component doesn't assume multiple items.
// ============================================================================
test("ReviewList works with a single review", () => {
  const singleReview = [testReviews[0]];
  const { container } = render(<ReviewList reviews={singleReview} />);

  expect(screen.getByText("Alice")).toBeInTheDocument();
  expect(screen.getByText("Reviews (1)")).toBeInTheDocument();
  expect(container.querySelectorAll(".MuiCard-root").length).toBe(1);
});

// ============================================================================
// 🎯 BONUS CHALLENGE: Write these ReviewList tests yourself!
//
// TEST IDEA A: Star ratings
//   MUI Rating component renders with role="img" or aria-label.
//   Test that a review with rating: 5 shows 5 filled stars.
//   Hint: MUI Rating renders individual star elements. Look for
//   elements with class "MuiRating-iconFilled" to count filled stars.
//
// TEST IDEA B: Edit button (Challenge 7)
//   After implementing edit, test that:
//   - Each review card has an "Edit" button
//   - The total number of Edit buttons matches the review count
//
// TEST IDEA C: Stress test with many reviews
//   Create an array of 100 reviews using Array.from():
//     const manyReviews = Array.from({ length: 100 }, (_, i) => ({
//       id: i, recipeId: 1, reviewerName: `User${i}`, comment: `Comment ${i}`, rating: 3
//     }));
//   Verify the component renders all 100 without crashing.
//   Hint: just check container.querySelectorAll(".MuiCard-root").length === 100
// ============================================================================
