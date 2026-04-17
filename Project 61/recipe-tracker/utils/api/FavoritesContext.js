// FavoritesContext.js — React Context for sharing favorites state across components
//
// WHAT IS CONTEXT?
// In C#, if you need data in a deeply nested component, you'd typically use
// Dependency Injection (DI) — register a service and inject it where needed.
// React Context is similar: you create a "container" for data (createContext),
// wrap your component tree with a Provider, and any child can access the data
// with useContext — no need to pass props through every level (prop drilling).
//
// WITHOUT context: Home → RecipeList → RecipeCard (must pass favorites through RecipeList even though it doesn't use them)
// WITH context:    Home provides favorites via context → RecipeCard grabs them directly

import { createContext } from "react";

// createContext() creates the container — like defining an interface for a service in C#
// The default value (empty object) is used only if a component uses useContext
// without being wrapped in a Provider (edge case / fallback)
export const FavoritesContext = createContext({});

// ==========================================================================
// 🎯 BONUS CHALLENGE 9: Dark Mode — Create a ThemeContext
// Make a new file: utils/api/ThemeContext.js
// Inside it, do the same pattern as this file:
//   import { createContext } from "react";
//   export const ThemeContext = createContext({});
// Then in _app.js:
//   1. import { ThemeProvider, createTheme } from "@mui/material/styles";
//   2. Add useState("light") for mode
//   3. Create theme: const theme = createTheme({ palette: { mode } });
//   4. Wrap <Component> with <ThemeProvider theme={theme}>
//   5. Also wrap with <ThemeContext.Provider value={{ mode, toggleMode }}>
//   6. toggleMode flips "light" ↔ "dark": setMode(prev => prev === "light" ? "dark" : "light")
// Then NavBar reads ThemeContext with useContext and shows a toggle button
// ==========================================================================
