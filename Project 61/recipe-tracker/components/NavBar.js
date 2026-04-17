// NavBar.js — Navigation bar component with links to Home and Favorites
// Uses MUI's AppBar and Toolbar for the layout.
// next/link is like <a> tags in HTML, but optimized for client-side navigation
// (similar to how Blazor uses <NavLink> for SPA routing).

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function NavBar() {
  // ==========================================================================
  // 🎯 BONUS CHALLENGE 2: Recipe Count Badge
  // Can you make NavBar accept props like { recipeCount, favoritesCount }?
  // Hint: change the function signature to: NavBar({ recipeCount, favoritesCount })
  // Then use them in the button text: Home ({recipeCount}) and Favorites ({favoritesCount})
  // You'll also need to pass these props from pages/index.js:
  //   <NavBar recipeCount={recipes.length} favoritesCount={favorites.length} />
  // C# analogy: like adding parameters to a Blazor component [Parameter]
  // ==========================================================================

  // ==========================================================================
  // 🎯 BONUS CHALLENGE 9: Dark Mode Toggle
  // Add an IconButton (import from @mui/material/IconButton) here
  // Use useContext to read a ThemeContext you'll create in utils/api/ThemeContext.js
  // The context should have { mode, toggleMode } where mode is "light" or "dark"
  // Clicking the button calls toggleMode()
  // Show a sun icon ☀️ when dark, moon icon 🌙 when light
  // The actual theme switching happens in _app.js with MUI's <ThemeProvider>
  // C# analogy: this is like toggling a theme resource dictionary in WPF
  // ==========================================================================
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#ef6c00" }}>
        <Toolbar>
          {/* App title — flexGrow: 1 pushes the nav buttons to the right */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🍳 Recipe Tracker
          </Typography>

          {/* next/link wraps around MUI Button for SPA-style navigation */}
          {/* In C#/Blazor, this would be <NavLink href="/"> */}
          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <Button sx={{ color: "white" }}>Home</Button>
          </Link>

          <Link href="/favorites" passHref style={{ textDecoration: "none" }}>
            <Button sx={{ color: "white" }}>Favorites</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
