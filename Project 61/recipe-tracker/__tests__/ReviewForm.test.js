// ============================================================================
// __tests__/ReviewForm.test.js — Unit tests for the ReviewForm component
//
// 🧪 WHAT ARE WE TESTING?
// ReviewForm is a controlled form (Step 6) with:
//   - Three controlled inputs (name, comment, rating)
//   - Form submission via onSubmit + e.preventDefault()
//   - POST to the API via postReview()
//   - Callback to parent via onReviewAdded prop
//   - Error handling with try/catch
//
// 🧪 TESTING FORMS — KEY PATTERNS:
//
// 1. Testing controlled inputs:
//    fireEvent.change(input, { target: { value: "new value" } })
//    expect(input).toHaveValue("new value")
//
// 2. Testing form submission:
//    fireEvent.click(submitButton)  — or — fireEvent.submit(form)
//    await waitFor(() => expect(callback).toHaveBeenCalled())
//
// 3. Testing error handling:
//    Use server.use() to make the API fail
//    Verify error message appears in the DOM
//
// C# analogy: Testing a WPF form with data bindings, button click handlers,
// and error display — like using AutomationPeer tests.
// ============================================================================

import "isomorphic-fetch";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { BASE_URL } from "../utils/api/recipes.js";
import ReviewForm from "../components/ReviewForm.js";

// Mock POST endpoint for reviews
const server = setupServer(
  http.post(`${BASE_URL}/api/recipes/1/reviews`, () => {
    return HttpResponse.json({
      id: 50,
      recipeId: 1,
      reviewerName: "TestUser",
      comment: "Loved it!",
      rating: 4,
    });
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// ============================================================================
// TEST 1: Does the form render all its fields?
//
// We check that label text and the submit button exist.
// This is a "smoke test" — if the component renders without crashing,
// the basics are working.
//
// C# analogy: just instantiating the form to make sure the constructor
// doesn't throw: var form = new ReviewForm(); Assert.IsNotNull(form);
// ============================================================================
test("ReviewForm renders name, comment, rating inputs and submit button", () => {
  render(<ReviewForm recipeId={1} onReviewAdded={jest.fn()} />);

  // MUI adds " *" to required field labels, so we use regex to match
  expect(screen.getByLabelText(/Your Name/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Your Review/)).toBeInTheDocument();
  // MUI Select doesn't use standard label-for association, so use getAllByText
  // (MUI renders "Rating" in both the label and the fieldset legend)
  expect(screen.getAllByText("Rating").length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText("Submit Review")).toBeInTheDocument();
});

// ============================================================================
// TEST 2: Can the user type into the name and comment fields?
//
// This verifies the controlled input pattern:
//   value={reviewerName} + onChange={(e) => setReviewerName(e.target.value)}
// If either is missing, the input won't update when typed into.
//
// .toHaveValue() checks the <input> element's current value attribute.
// ============================================================================
test("Name and comment inputs accept user typing", () => {
  render(<ReviewForm recipeId={1} onReviewAdded={jest.fn()} />);

  const nameInput = screen.getByLabelText(/Your Name/);
  fireEvent.change(nameInput, { target: { value: "Daniel" } });
  expect(nameInput).toHaveValue("Daniel");

  const commentInput = screen.getByLabelText(/Your Review/);
  fireEvent.change(commentInput, { target: { value: "So tasty!" } });
  expect(commentInput).toHaveValue("So tasty!");
});

// ============================================================================
// TEST 3: Does submitting the form call onReviewAdded callback?
//
// WHAT WE'RE TESTING:
//   The full submission flow:
//   1. User fills out form → 2. Clicks submit → 3. POST fires →
//   4. onReviewAdded(newReview) is called → 5. Form resets
//
// jest.fn() records calls, so we can verify:
//   - it WAS called: expect(mockCallback).toHaveBeenCalled()
//   - it was called with the right data: .toHaveBeenCalledWith(expectedObject)
//   - how many times: .toHaveBeenCalledTimes(1)
//
// C# analogy:
//   var mockCallback = new Mock<Action<Review>>();
//   form.Submit();
//   mockCallback.Verify(c => c(It.IsAny<Review>()), Times.Once());
// ============================================================================
test("Submitting the form calls onReviewAdded with the new review", async () => {
  const mockOnReviewAdded = jest.fn();
  render(<ReviewForm recipeId={1} onReviewAdded={mockOnReviewAdded} />);

  // Fill in the form
  fireEvent.change(screen.getByLabelText(/Your Name/), {
    target: { value: "TestUser" },
  });
  fireEvent.change(screen.getByLabelText(/Your Review/), {
    target: { value: "Loved it!" },
  });

  // Click submit
  fireEvent.click(screen.getByText("Submit Review"));

  // Wait for the async POST to complete
  await waitFor(() => {
    expect(mockOnReviewAdded).toHaveBeenCalledTimes(1);
  });

  // Verify the callback received the correct data from the mock API
  const receivedReview = mockOnReviewAdded.mock.calls[0][0];
  expect(receivedReview.reviewerName).toBe("TestUser");
  expect(receivedReview.comment).toBe("Loved it!");
  expect(receivedReview.rating).toBe(4);
});

// ============================================================================
// TEST 4: Does the form reset after successful submission?
//
// WHAT WE'RE TESTING:
//   After a successful POST, the form fields should clear:
//   setReviewerName(""), setComment(""), setRating(5)
//
// We check the input values AFTER submission completes.
// ============================================================================
test("Form fields reset to empty after successful submission", async () => {
  render(<ReviewForm recipeId={1} onReviewAdded={jest.fn()} />);

  // Fill and submit
  const nameInput = screen.getByLabelText(/Your Name/);
  const commentInput = screen.getByLabelText(/Your Review/);

  fireEvent.change(nameInput, { target: { value: "TestUser" } });
  fireEvent.change(commentInput, { target: { value: "Great!" } });
  fireEvent.click(screen.getByText("Submit Review"));

  // After submission, inputs should be reset to empty
  await waitFor(() => {
    expect(nameInput).toHaveValue("");
    expect(commentInput).toHaveValue("");
  });
});

// ============================================================================
// TEST 5: Does an error message appear when the API fails?
//
// WHAT WE'RE TESTING:
//   - When postReview() throws an error, the catch block runs
//   - setError() is called with an error message
//   - The <Alert> component appears in the DOM
//
// We use server.use() to OVERRIDE the POST endpoint to return a 500 error.
// This only affects this one test — afterEach resets it.
//
// C# analogy:
//   mockHttpClient.Setup(c => c.PostAsync(...)).ThrowsAsync(new HttpRequestException());
//   form.Submit();
//   Assert.IsTrue(errorLabel.IsVisible);
// ============================================================================
test("Shows error message when API call fails", async () => {
  // Override the POST endpoint to simulate a server error
  server.use(
    http.post(`${BASE_URL}/api/recipes/1/reviews`, () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  const mockOnReviewAdded = jest.fn();
  render(<ReviewForm recipeId={1} onReviewAdded={mockOnReviewAdded} />);

  // Fill and submit
  fireEvent.change(screen.getByLabelText(/Your Name/), {
    target: { value: "TestUser" },
  });
  fireEvent.change(screen.getByLabelText(/Your Review/), {
    target: { value: "This will fail" },
  });
  fireEvent.click(screen.getByText("Submit Review"));

  // The error alert should appear
  await waitFor(() => {
    expect(screen.getByText(/failed to submit review/i)).toBeInTheDocument();
  });

  // onReviewAdded should NOT have been called (the POST failed)
  expect(mockOnReviewAdded).not.toHaveBeenCalled();
});

// ============================================================================
// TEST 6: Does the "Write a Review" heading render?
//
// Simple smoke test for the section heading.
// ============================================================================
test("ReviewForm displays 'Write a Review' heading", () => {
  render(<ReviewForm recipeId={1} onReviewAdded={jest.fn()} />);
  expect(screen.getByText("Write a Review")).toBeInTheDocument();
});

// ============================================================================
// 🎯 BONUS CHALLENGE: Write these ReviewForm tests yourself!
//
// TEST IDEA A: Double submission prevention
//   What happens if the user clicks Submit twice quickly?
//   Currently there's no protection — can you add a "submitting" useState
//   in ReviewForm.js that disables the button during the POST?
//   Then test: click submit → button becomes disabled → re-enables after
//   Hint: expect(submitButton).toBeDisabled() during the await
//
// TEST IDEA B: Rating selection
//   Test that changing the rating Select works:
//   - Find the rating select and change it to value 2
//   - Submit the form and verify the callback received rating: 2
//   Note: MUI Select is tricky to test! The underlying element might
//   be an <input> with role="combobox". Try:
//     fireEvent.mouseDown(screen.getByLabelText("Rating"))
//     fireEvent.click(screen.getByText("2 - Fair"))
//
// TEST IDEA C: Error clears on retry
//   1. Make the API fail (server.use with 500)
//   2. Submit → error appears
//   3. Reset the server: server.resetHandlers()
//   4. Submit again → error should disappear and review should be added
//   Hint: the form already calls setError("") at the start of handleSubmit
// ============================================================================
