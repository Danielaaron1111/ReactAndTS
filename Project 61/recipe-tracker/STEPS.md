# 📚 STEPS.md — 6-Step React Learning Guide

This document explains each of the 6 progressive steps in the Recipe Tracker project. Each step introduces specific React concepts, tells you which files to study, and explains in plain English what the code does.

---

## Step 1: useState + Static Data

**Concepts taught:** `useState`, controlled inputs, `.map()`, `.filter()`, `key` prop, props

**Files to look at:**
- `components/RecipeList.js` — search filter with controlled input
- `components/RecipeCard.js` — displays a single recipe card

**What the code does:**

`RecipeList` uses `useState("")` to store a search term. The `<TextField>` is a *controlled input* — its `value` is always equal to the state variable `searchTerm`, and `onChange` updates the state whenever the user types.

The `.filter()` method creates a new array containing only recipes whose title includes the search term. This is like LINQ's `.Where()` in C#. Then `.map()` transforms each recipe into a `<RecipeCard>` component — like LINQ's `.Select()`.

Every item rendered in a `.map()` must have a unique `key` prop so React can efficiently track which items changed, were added, or removed. Think of it like a primary key for list rendering.

**C# analogy:** `useState` is like a property with `INotifyPropertyChanged`. When you call the setter (`setSearchTerm`), React re-renders — similar to how WPF re-renders when a bound property fires `PropertyChanged`.

---

## Step 2: useEffect + Fetching (GET)

**Concepts taught:** `useEffect` with `[]`, `async/await`, loading state, side effects

**Files to look at:**
- `pages/index.js` — fetches recipes on mount
- `utils/api/recipes.js` — `getRecipes()` and `getFavorites()` helper functions

**What the code does:**

`useEffect` runs a function *after* the component renders. The empty dependency array `[]` means "run this once when the component first appears on screen."

Inside the effect, we call `getRecipes()` which uses `async/await` to fetch data from `/api/recipes`. While waiting, a `CircularProgress` spinner shows. Once data arrives, we call `setRecipes(data)` to store it in state, and `setLoading(false)` to hide the spinner.

**C# analogy:** `useEffect(() => { ... }, [])` is like Blazor's `OnInitializedAsync()` — code that runs once when the component initializes. The `async/await` pattern works exactly like C#'s `await httpClient.GetAsync()`.

**Why not put `async` on useEffect directly?** Because `useEffect` expects either nothing or a cleanup function as a return value, not a Promise. So we define an `async function` inside and call it.

---

## Step 3: POST + State Update (Favorites)

**Concepts taught:** POST fetch, event handlers, `.some()`, conditional button disable

**Files to look at:**
- `components/RecipeCard.js` — `handleFavorite` function
- `utils/api/recipes.js` — `postFavorite()` helper

**What the code does:**

When the user clicks the "Favorite" button, `handleFavorite` sends a POST request to `/api/favorites` with the recipe's ID. The API saves it to the database and returns the new favorite object.

We then update state with `setFavorites([...favorites, newFavorite])`. The spread operator `...` copies all existing favorites into a new array and adds the new one at the end.

`.some()` checks if the recipe is already favorited: `favorites.some(fav => fav.recipeId === recipe.id)`. If true, the button shows "★ Favorited" and is disabled.

**C# analogy:** `.some()` is like LINQ's `.Any()` — it returns `true` if any element matches the condition. The spread operator `[...array, newItem]` is like `new List<T>(existingList) { newItem }`.

---

## Step 4: useContext (Remove Prop Drilling)

**Concepts taught:** `createContext`, `Provider`, `useContext`, prop drilling vs context

**Files to look at:**
- `utils/api/FavoritesContext.js` — creates the context
- `pages/index.js` — wraps children in `<FavoritesContext.Provider>`
- `components/RecipeCard.js` — consumes context with `useContext`

**What the code does:**

**Before context (prop drilling):** The favorites data would flow: `Home → RecipeList → RecipeCard`. RecipeList doesn't use favorites — it just passes them through. This is "prop drilling."

**With context:** Home wraps its content in `<FavoritesContext.Provider value={{ favorites, setFavorites }}>`. Now `RecipeCard` can call `useContext(FavoritesContext)` to directly access `favorites` and `setFavorites` — skipping RecipeList entirely.

**C# analogy:** Context is like Dependency Injection. Instead of passing a service through every constructor (prop drilling), you register it once (Provider) and inject it where needed (useContext). It's like `[Inject] private IFavoritesService FavoritesService` in Blazor.

---

## Step 5: Multi-Page Routing + DELETE

**Concepts taught:** `next/link`, `useRouter`, dynamic routes, DELETE fetch, `.filter()` state update

**Files to look at:**
- `components/NavBar.js` — navigation with `next/link`
- `pages/favorites.js` — favorites page with Remove button
- `pages/recipe/[id].js` — dynamic route for recipe details

**What the code does:**

**Navigation:** `NavBar` uses `<Link href="/">` and `<Link href="/favorites">` for client-side navigation. Unlike `<a>` tags which cause full page reloads, `next/link` does SPA-style navigation (only the page content changes).

**Dynamic routes:** The file `pages/recipe/[id].js` creates a dynamic route. When you visit `/recipe/3`, Next.js makes `id = "3"` available via `useRouter().query.id`.

**DELETE:** On the favorites page, clicking "Remove" calls `deleteFavorite(favoriteId)` which sends a DELETE request. Then `.filter()` updates state by creating a new array without the deleted item: `favorites.filter(fav => fav.id !== favoriteId)`.

**C# analogy:** `next/link` is like Blazor's `<NavLink>`. `useRouter` is like `NavigationManager` or `HttpContext.Request.RouteValues`. `.filter()` after DELETE is like `favorites.RemoveAll(f => f.Id == id)`, except in React we always create a new list instead of mutating.

---

## Step 6: Forms + POST (Reviews)

**Concepts taught:** form `onSubmit`, `e.preventDefault()`, controlled inputs, error handling, multiple `useState`

**Files to look at:**
- `components/ReviewForm.js` — controlled form with multiple inputs
- `components/ReviewList.js` — displays submitted reviews
- `pages/recipe/[id].js` — ties reviews and form together

**What the code does:**

`ReviewForm` has three controlled inputs (name, comment, rating), each with its own `useState`. When the form submits:

1. `e.preventDefault()` stops the browser from doing a full page reload (default HTML form behavior)
2. We `await postReview(recipeId, { reviewerName, comment, rating })` to send the data to the API
3. On success, we call `onReviewAdded(newReview)` — a callback from the parent — to add the review to the displayed list
4. We reset the form fields to empty values
5. If the fetch fails, `catch` sets an error message that displays as an `<Alert>`

**C# analogy:** `e.preventDefault()` is something you don't need in Blazor because `@onsubmit` already prevents default. Multiple `useState` calls are like having multiple properties in a ViewModel. The `onReviewAdded` callback is like a C# event: `public event Action<Review> ReviewAdded`.

---

## Summary Table

| Step | Concept | Key React APIs | C# Equivalent |
|------|---------|---------------|---------------|
| 1 | State + static data | `useState`, `.map()`, `.filter()` | `INotifyPropertyChanged`, LINQ `.Select()`, `.Where()` |
| 2 | Side effects + fetching | `useEffect`, `async/await` | `OnInitializedAsync()`, `HttpClient` |
| 3 | POST + state update | `fetch POST`, `.some()`, spread `...` | `PostAsync`, LINQ `.Any()`, `new List(old) { new }` |
| 4 | Context (no prop drilling) | `createContext`, `Provider`, `useContext` | Dependency Injection, `[Inject]` |
| 5 | Routing + DELETE | `next/link`, `useRouter`, `fetch DELETE`, `.filter()` | `<NavLink>`, `NavigationManager`, `RemoveAll` |
| 6 | Forms + error handling | `onSubmit`, `e.preventDefault()`, `try/catch` | `@onsubmit`, ViewModel properties, `try/catch` |
