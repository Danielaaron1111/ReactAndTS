// jest.config.mjs — Jest configuration for Next.js
//
// WHAT IS JEST?
// Jest is a testing framework for JavaScript — like NUnit or xUnit in C#.
// It runs your test files, checks assertions, and reports pass/fail.
//
// WHAT IS next/jest?
// Next.js has a special Jest helper that automatically handles:
// - Module path aliases (@/ imports)
// - CSS/image mock imports
// - Next.js-specific transforms
// In C#, this would be like having a test project that auto-references your main project.

import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Tell Next.js Jest where your app is so it can load config
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  // Where to look for test files
  moduleDirectories: ['node_modules', '<rootDir>/'],

  // jest-fixed-jsdom simulates a browser environment (DOM, window, document)
  // Without this, React components can't render in tests because there's no "browser"
  // In C#, you don't need this because WPF/Blazor tests use different rendering engines
  testEnvironment: 'jest-fixed-jsdom',

  // Needed for MSW (Mock Service Worker) v2 compatibility
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
}

export default createJestConfig(config)
