# 🎯 BONUS-CHALLENGES.md — Extra Practice Tasks

Try these challenges AFTER you understand the 6 steps. Each one reinforces a concept from the project. Difficulty goes from ⭐ (easy) to ⭐⭐⭐ (hard).

---

## Challenge 1: Category Filter Dropdown ⭐
**Concept:** `useState` + controlled input + `.filter()`

**Task:** Add a `<Select>` dropdown to the Home page that filters recipes by category (Breakfast, Lunch, Dinner, Dessert, All).

**Hints:**
- Add a new `useState` for `selectedCategory` in `RecipeList.js`
- Chain another `.filter()` after the search filter
- "All" should show everything (don't filter)

**Files to edit:** `components/RecipeList.js`

---

## Challenge 2: Recipe Count Badge ⭐
**Concept:** Props, derived data

**Task:** Show the total number of recipes and favorites in the NavBar (e.g., "Home (6)" and "Favorites (2)").

**Hints:**
- Pass `recipeCount` and `favoritesCount` as props to `NavBar`
- Use `.length` on the arrays
- C# analogy: like passing `ViewBag.Count` to a partial view

**Files to edit:** `components/NavBar.js`, `pages/index.js`

---

## Challenge 3: Loading Skeleton ⭐
**Concept:** Conditional rendering, MUI components

**Task:** Replace the `CircularProgress` spinner with MUI `<Skeleton>` cards that mimic the shape of `RecipeCard` while loading.

**Hints:**
- Import `Skeleton` from `@mui/material/Skeleton`
- Render 3-4 skeleton cards with the same width as RecipeCard (320px)
- Use `variant="rectangular"` for the card body

**Files to edit:** `pages/index.js`

---

## Challenge 4: Confirm Before Remove ⭐⭐
**Concept:** Event handling, `window.confirm()`

**Task:** When clicking "Remove" on the Favorites page, show a confirmation dialog before actually deleting.

**Hints:**
- Use `if (window.confirm("Remove this favorite?"))` before calling the API
- This is like `MessageBox.Show()` in C# WPF

**Files to edit:** `pages/favorites.js`

---

## Challenge 5: Average Rating Display ⭐⭐
**Concept:** `.reduce()`, derived state

**Task:** On the recipe detail page, show the average rating above the reviews list (e.g., "Average Rating: 4.2 ★").

**Hints:**
- Use `.reduce()` to sum all ratings, then divide by `reviews.length`
- `.reduce()` is like LINQ's `.Aggregate()` in C#
- Handle the case where there are 0 reviews (avoid dividing by zero)

**Files to edit:** `pages/recipe/[id].js`

---

## Challenge 6: Sort Recipes ⭐⭐
**Concept:** `.sort()`, `useState` for sort option

**Task:** Add a sort dropdown on the Home page: "Sort by Title (A-Z)", "Sort by Title (Z-A)", "Sort by Prep Time".

**Hints:**
- Add a `useState` for `sortOption`
- Chain `.sort()` after `.filter()` (but use `[...filteredRecipes].sort()` — never mutate!)
- `.sort()` is like LINQ's `.OrderBy()` in C#
- `"30 min"` needs `parseInt()` to sort numerically

**Files to edit:** `components/RecipeList.js`

---

## Challenge 7: Edit a Review ⭐⭐⭐
**Concept:** PUT/PATCH fetch, conditional rendering, form pre-fill

**Task:**
1. Add a new API route: `PUT /api/recipes/[recipeId]/reviews/[reviewId]`
2. Add an "Edit" button on each review in `ReviewList`
3. Clicking "Edit" replaces that review with a pre-filled form
4. On submit, PUT the updated data and update state

**Hints:**
- You'll need a `useState` to track which review is being edited (`editingId`)
- Conditionally render either the review text OR an edit form
- Use `.map()` to replace the updated review in state:
  ```js
  setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r))
  ```
- C# analogy: `.map()` with replacement is like `reviews.Select(r => r.Id == id ? updated : r).ToList()`

**Files to create:** `pages/api/recipes/[recipeId]/reviews/[reviewId].js`
**Files to edit:** `components/ReviewList.js`, `utils/api/recipes.js`

---

## Challenge 8: Pagination ⭐⭐⭐
**Concept:** `useState` for page number, `.slice()`, derived data

**Task:** Show only 3 recipes per page on the Home page, with "Previous" and "Next" buttons.

**Hints:**
- Add `useState(1)` for `currentPage` and a constant `RECIPES_PER_PAGE = 3`
- Use `.slice(startIndex, endIndex)` on the filtered array
- `.slice()` is like LINQ's `.Skip(n).Take(m)` in C#
- Disable "Previous" on page 1, disable "Next" on the last page

**Files to edit:** `components/RecipeList.js`

---

## Challenge 9: Dark Mode Toggle ⭐⭐⭐
**Concept:** `useContext`, MUI theming, `createTheme`

**Task:** Add a dark/light mode toggle button in the NavBar that switches the entire app's theme.

**Hints:**
- Create a `ThemeContext` with `createContext`
- Use MUI's `createTheme()` and `<ThemeProvider>` in `_app.js`
- Store the mode in `useState("light")` and toggle between "light" and "dark"
- Wrap the app with both `ThemeProvider` and your `ThemeContext.Provider`

**Files to create:** `utils/api/ThemeContext.js`
**Files to edit:** `pages/_app.js`, `components/NavBar.js`

---

## Challenge 10: Local Storage Persistence ⭐⭐⭐
**Concept:** `useEffect` for side effects, `localStorage`, JSON serialization

**Task:** Save the user's favorites to `localStorage` so they persist after refreshing the browser (even without the database).

**Hints:**
- Use `useEffect` with `[favorites]` dependency to save whenever favorites change:
  ```js
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  ```
- On mount, check `localStorage.getItem("favorites")` before fetching from API
- `localStorage` is like C#'s `IsolatedStorage` or browser cookies — data persists in the browser

**Files to edit:** `pages/index.js`

---

## 🏆 Completion Checklist

| # | Challenge | Difficulty | Concept Practiced |
|---|-----------|-----------|-------------------|
| 1 | Category Filter | ⭐ | useState, .filter() |
| 2 | Recipe Count Badge | ⭐ | Props, .length |
| 3 | Loading Skeleton | ⭐ | Conditional rendering |
| 4 | Confirm Before Remove | ⭐⭐ | Event handling |
| 5 | Average Rating | ⭐⭐ | .reduce(), derived state |
| 6 | Sort Recipes | ⭐⭐ | .sort(), useState |
| 7 | Edit a Review | ⭐⭐⭐ | PUT fetch, conditional forms |
| 8 | Pagination | ⭐⭐⭐ | .slice(), page state |
| 9 | Dark Mode | ⭐⭐⭐ | useContext, MUI theming |
| 10 | Local Storage | ⭐⭐⭐ | useEffect side effects, persistence |

**Tip:** Try them in order — each builds on skills from the previous ones! 💪
