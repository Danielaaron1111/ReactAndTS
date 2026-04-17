// _app.js — The root component that wraps every page in the app
// In C#, this is like App.xaml or _Layout.cshtml — it runs on every page.
// We import global CSS and fonts here so they apply everywhere.

import "@/styles/globals.css";

// Roboto font — MUI's default font. These imports load the font files.
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function App({ Component, pageProps }) {
  // Component is whatever page is being displayed (index.js, favorites.js, etc.)
  // pageProps are any props passed to that page
  return <Component {...pageProps} />;
}
