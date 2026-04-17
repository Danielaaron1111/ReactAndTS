// RecipeList.js — Displays a filtered list of RecipeCard components
//
// STEP 1 CONCEPT: useState + controlled inputs + .filter() + .map()
//
// useState is React's way of storing data that can change over time.
// In C#, it's like having a property with INotifyPropertyChanged —
// when the value changes, the UI automatically re-renders.
//
// A "controlled input" means the input's value is controlled by React state.
// In C# WPF/MAUI, this is like two-way data binding with {Binding SearchText}.
// In React, you set value={searchTerm} and onChange updates the state.

import { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RecipeCard from "./RecipeCard";

export default function RecipeList({ recipes }) {
  // useState returns [currentValue, setterFunction]
  // This is like: private string _searchTerm = ""; in C#
  // Except when you call setSearchTerm(), React re-renders the component automatically
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================================================
  // 🎯 BONUS CHALLENGE 1: Category Filter Dropdown
  // Can you add a second useState here to track a selectedCategory?
  // Hint: const [selectedCategory, set_____] = useState("All");
  // Then add a <Select> dropdown below the search TextField with options:
  //   "All", "Breakfast", "Lunch", "Dinner", "Dessert"
  // Finally, chain another .filter() after the search filter:
  //   .filter(recipe => selectedCategory === "All" || recipe.category === _____)
  // C# analogy: this is like adding a second .Where() clause in LINQ
  // ==========================================================================

  // ==========================================================================
  // 🎯 BONUS CHALLENGE 6: Sort Recipes
  // Add a useState for sortOption (e.g., "title-asc", "title-desc", "prep-time")
  // After filtering, chain: [...filteredRecipes].sort((a, b) => { ... })
  // IMPORTANT: NEVER call .sort() directly on state — always spread into a new array first!
  //   Why? .sort() mutates the original array, which breaks React's immutability rule.
  //   C# analogy: it's like doing list.OrderBy() which returns a NEW sequence
  // For "prep-time", you'll need parseInt(a.prepTime) to compare numbers
  // ==========================================================================

  // ==========================================================================
  // 🎯 BONUS CHALLENGE 8: Pagination
  // Add useState for currentPage (start at 1)
  // Define a constant: const RECIPES_PER_PAGE = 3;
  // Use .slice() on filteredRecipes to show only the current page:
  //   .slice((currentPage - 1) * RECIPES_PER_PAGE, currentPage * RECIPES_PER_PAGE)
  // C# analogy: .slice(start, end) is like LINQ's .Skip(start).Take(count)
  // Add "Previous" and "Next" <Button>s below the recipe cards
  // Disable "Previous" when currentPage === 1
  // Disable "Next" when currentPage * RECIPES_PER_PAGE >= filteredRecipes.length
  // Don't forget to reset currentPage to 1 when the search term changes!
  // ==========================================================================

  // .filter() is like LINQ's .Where() in C# — it returns a new array with only matching items
  // .toLowerCase() ensures case-insensitive search
  // Example: recipes.filter(r => r.title.includes(searchTerm))
  //   C# equivalent: recipes.Where(r => r.Title.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ mt: 3 }}>
      {/* Controlled input: value is tied to state, onChange updates state */}
      {/* In C# WPF: <TextBox Text="{Binding SearchTerm}" /> */}
      <TextField
        label="Search recipes..."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {filteredRecipes.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
          No recipes found matching &quot;{searchTerm}&quot;
        </Typography>
      ) : (
        // .map() is like LINQ's .Select() in C# — it transforms each item into JSX
        // The "key" prop is REQUIRED when rendering lists — React uses it to track which
        // items changed. It's like setting a unique identifier for each list item.
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </Box>
      )}
    </Box>
  );
}
