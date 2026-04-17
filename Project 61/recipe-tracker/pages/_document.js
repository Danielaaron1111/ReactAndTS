// _document.js — Customizes the HTML document structure
// In C#, this is like the <html> wrapper in _Layout.cshtml

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
