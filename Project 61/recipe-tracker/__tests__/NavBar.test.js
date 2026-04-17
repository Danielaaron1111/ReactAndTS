// ============================================================================
// __tests__/NavBar.test.js — Unit tests for the NavBar component
//
// 🧪 WHAT ARE WE TESTING?
// NavBar is a simple presentational component (no state, no side effects).
// These tests verify that:
//   - The app title renders
//   - Navigation links are present and point to the correct routes
//
// 🧪 WHY TEST SIMPLE COMPONENTS?
// Even "dumb" components can break! Testing them gives you confidence that:
//   - The imports are correct (a missing import crashes the whole app)
//   - The links go to the right pages
//   - The text content is what you expect
//
// In C#, this is like testing that a Razor partial view renders without errors
// and that its anchor tags have the correct href attributes.
//
// 🧪 NEW CONCEPT: Testing links
// next/link renders an <a> tag under the hood. We can find it with
// container.querySelector('a[href="/favorites"]') or use getByRole("link").
// ============================================================================

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import NavBar from "../components/NavBar.js";

// ============================================================================
// TEST 1: Does the NavBar render the app title?
//
// This is the simplest possible test — render a component and check its text.
// If this fails, something is fundamentally broken (bad import, syntax error, etc.)
//
// C# equivalent:
//   [Fact] public void NavBar_Should_RenderAppTitle()
//   {
//       var component = RenderComponent<NavBar>();
//       Assert.Contains("Recipe Tracker", component.Markup);
//   }
// ============================================================================
test("NavBar renders the app title", () => {
  render(<NavBar />);

  // /recipe tracker/i means: find text containing "recipe tracker", case-insensitive
  // The /i flag makes it case-insensitive — useful because the actual text has an emoji
  expect(screen.getByText(/recipe tracker/i)).toBeInTheDocument();
});

// ============================================================================
// TEST 2: Does the NavBar have a Home link?
//
// We check that:
//   1. A button/link with "Home" text exists
//   2. The link's href points to "/"
//
// container.querySelector('a[href="/"]') is like CSS selector syntax:
//   "find an <a> tag whose href attribute equals '/'"
// C# equivalent: Assert.IsNotNull(component.Find("a[href='/']"));
// ============================================================================
test("NavBar has a Home link pointing to /", () => {
  const { container } = render(<NavBar />);

  expect(screen.getByText("Home")).toBeInTheDocument();

  // Verify the link destination — next/link renders as <a href="/">
  const homeLink = container.querySelector('a[href="/"]');
  expect(homeLink).toBeInTheDocument();
});

// ============================================================================
// TEST 3: Does the NavBar have a Favorites link?
// ============================================================================
test("NavBar has a Favorites link pointing to /favorites", () => {
  const { container } = render(<NavBar />);

  expect(screen.getByText("Favorites")).toBeInTheDocument();

  const favoritesLink = container.querySelector('a[href="/favorites"]');
  expect(favoritesLink).toBeInTheDocument();
});

// ============================================================================
// TEST 4: Does the NavBar use an MUI AppBar?
//
// We verify the component renders with MUI's expected class names.
// This ensures we're using MUI components (not plain HTML) as required.
//
// MUI AppBar renders with class "MuiAppBar-root"
// This is a structural test — checking HOW something renders, not just WHAT.
// ============================================================================
test("NavBar uses MUI AppBar component", () => {
  const { container } = render(<NavBar />);

  const appBar = container.querySelector(".MuiAppBar-root");
  expect(appBar).toBeInTheDocument();
});

// ============================================================================
// 🎯 BONUS CHALLENGE: Write these NavBar tests yourself!
//
// TEST IDEA A: Recipe count badge (Challenge 2)
//   After you add recipeCount and favoritesCount props to NavBar, test:
//     render(<NavBar recipeCount={6} favoritesCount={2} />)
//   Verify that "Home (6)" and "Favorites (2)" appear in the text.
//   Hint: screen.getByText(/Home \(6\)/) — escape parentheses in regex!
//
// TEST IDEA B: Dark mode toggle (Challenge 9)
//   After implementing the toggle, test that:
//   - A toggle button exists in the NavBar
//   - Clicking it calls the toggleMode function from ThemeContext
//   Hint: you'll need to wrap <NavBar /> in a ThemeContext.Provider
//   with a mock value: { mode: "light", toggleMode: jest.fn() }
//   Then after clicking, verify: expect(mockToggle).toHaveBeenCalledTimes(1)
//   jest.fn() tracks how many times a function was called — like Verify() in Moq
// ============================================================================
