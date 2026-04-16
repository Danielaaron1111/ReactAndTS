# React & TypeScript Mastery Guide

A structured, topic-by-topic roadmap to becoming an expert in React and TypeScript — from the fundamentals to advanced patterns used in production applications.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [TypeScript Fundamentals](#2-typescript-fundamentals)
3. [React Core Concepts](#3-react-core-concepts)
4. [TypeScript + React Integration](#4-typescript--react-integration)
5. [State Management](#5-state-management)
6. [Routing](#6-routing)
7. [Data Fetching & Async Patterns](#7-data-fetching--async-patterns)
8. [Styling Approaches](#8-styling-approaches)
9. [Testing](#9-testing)
10. [Performance Optimization](#10-performance-optimization)
11. [Advanced React Patterns](#11-advanced-react-patterns)
12. [Tooling & Build Systems](#12-tooling--build-systems)
13. [Architecture & Project Structure](#13-architecture--project-structure)
14. [Real-World Projects to Build](#14-real-world-projects-to-build)
15. [Resources](#15-resources)

---

## 1. Prerequisites

Before diving in, make sure you are comfortable with:

- **HTML & CSS** — semantic markup, Flexbox, Grid
- **JavaScript (ES6+)** — arrow functions, destructuring, spread/rest, modules (`import`/`export`), Promises, `async/await`, array methods (`.map`, `.filter`, `.reduce`)
- **Command line basics** — navigating directories, running scripts
- **Node.js & npm/yarn/pnpm** — installing packages, running scripts

> Skipping this foundation is the #1 reason beginners get stuck. Invest time here first.

---

## 2. TypeScript Fundamentals

TypeScript is a superset of JavaScript that adds static typing. Master these topics in order:

### 2.1 Basic Types
```ts
let name: string = "Alice";
let age: number = 30;
let active: boolean = true;
let tags: string[] = ["react", "ts"];
let tuple: [string, number] = ["hello", 1];
```

### 2.2 Interfaces & Type Aliases
```ts
interface User {
  id: number;
  name: string;
  email?: string; // optional
}

type Status = "active" | "inactive" | "pending"; // union type
```

### 2.3 Functions
```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}

const add = (a: number, b: number): number => a + b;
```

### 2.4 Generics
```ts
function identity<T>(value: T): T {
  return value;
}

const result = identity<string>("hello"); // "hello"
```

### 2.5 Utility Types
```ts
type PartialUser = Partial<User>;       // all fields optional
type RequiredUser = Required<User>;     // all fields required
type ReadonlyUser = Readonly<User>;     // immutable
type UserName = Pick<User, "name">;     // pick subset
type WithoutId = Omit<User, "id">;      // omit fields
```

### 2.6 Type Narrowing & Guards
```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}
```

### 2.7 Enums & Literal Types
```ts
enum Direction { Up, Down, Left, Right }

type Theme = "light" | "dark";
```

**Practice goal:** Rewrite plain JavaScript functions and objects using TypeScript types without any `any`.

---

## 3. React Core Concepts

### 3.1 JSX
JSX is a syntax extension that looks like HTML inside JavaScript. Every JSX element compiles to `React.createElement`.

```tsx
const element = <h1 className="title">Hello, World!</h1>;
```

### 3.2 Functional Components
```tsx
function Welcome({ name }: { name: string }) {
  return <p>Welcome, {name}!</p>;
}
```

### 3.3 Props & Children
```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### 3.4 State with `useState`
```tsx
const [count, setCount] = React.useState(0);
```

### 3.5 Side Effects with `useEffect`
```tsx
useEffect(() => {
  document.title = `Count: ${count}`;
  return () => { /* cleanup */ };
}, [count]); // dependency array
```

### 3.6 Core Hooks Reference

| Hook | Purpose |
|------|---------|
| `useState` | Local component state |
| `useEffect` | Side effects (fetch, subscriptions, DOM) |
| `useContext` | Consume React context |
| `useRef` | Mutable ref / DOM access |
| `useMemo` | Memoize expensive computations |
| `useCallback` | Memoize functions |
| `useReducer` | Complex state logic |

### 3.7 Conditional Rendering
```tsx
{isLoggedIn ? <Dashboard /> : <Login />}
{error && <ErrorMessage message={error} />}
```

### 3.8 Lists & Keys
```tsx
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}
```

---

## 4. TypeScript + React Integration

This is where both technologies converge into their most powerful form.

### 4.1 Typing Props
```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

function Button({ label, onClick, variant = "primary", disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled} className={variant}>{label}</button>;
}
```

### 4.2 Typing Events
```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

### 4.3 Typing `useState` with Complex State
```tsx
interface User { id: number; name: string; }

const [user, setUser] = useState<User | null>(null);
```

### 4.4 Typing `useRef`
```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

### 4.5 Typing `useContext`
```tsx
interface ThemeContextType { theme: "light" | "dark"; toggle: () => void; }

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
```

### 4.6 Generic Components
```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}
```

---

## 5. State Management

### 5.1 Local State — `useState` / `useReducer`
Best for component-scoped state. Use `useReducer` when state transitions are complex.

### 5.2 Shared State — Context API
Suitable for low-frequency updates (theme, auth, locale). Avoid for high-frequency state (frequent re-renders).

### 5.3 Global State Libraries

| Library | Best For |
|---------|---------|
| **Zustand** | Simple, boilerplate-free global state |
| **Redux Toolkit** | Large apps, complex state logic, DevTools |
| **Jotai / Recoil** | Atomic state, fine-grained subscriptions |
| **TanStack Query** | Server state (caching, fetching, syncing) |

**Recommendation for beginners:** Start with `useState` + Context, then adopt Zustand or TanStack Query as needs grow.

---

## 6. Routing

### React Router v6
```tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Key Concepts
- `useParams` — read URL params (`:id`)
- `useNavigate` — programmatic navigation
- `useSearchParams` — query strings
- Nested routes — layout-based routing
- Protected routes — redirect unauthenticated users

---

## 7. Data Fetching & Async Patterns

### 7.1 Fetch API + `useEffect`
```tsx
useEffect(() => {
  fetch("/api/users")
    .then((res) => res.json())
    .then(setUsers)
    .catch(setError);
}, []);
```

### 7.2 TanStack Query (Recommended)
```tsx
import { useQuery } from "@tanstack/react-query";

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((r) => r.json()),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;
  return <UserList users={data} />;
}
```

### 7.3 Key Topics
- Loading, error, and success states
- Optimistic updates
- Pagination & infinite scroll
- Mutations (`useMutation`)
- Cache invalidation

---

## 8. Styling Approaches

| Approach | Libraries | Best For |
|----------|-----------|---------|
| CSS Modules | Built-in (Vite/CRA) | Scoped styles, no runtime |
| Utility-first | Tailwind CSS | Fast prototyping, consistent design |
| CSS-in-JS | styled-components, Emotion | Dynamic styles tied to component logic |
| Component libraries | shadcn/ui, MUI, Chakra | Pre-built accessible components |

**Recommended for beginners:** Tailwind CSS + shadcn/ui — fast, modern, TypeScript-friendly.

---

## 9. Testing

### 9.1 Unit & Integration Tests — Vitest + React Testing Library
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Counter } from "./Counter";

test("increments count on click", () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole("button", { name: /increment/i }));
  expect(screen.getByText("1")).toBeInTheDocument();
});
```

### 9.2 End-to-End Tests — Playwright
```ts
test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', "user@example.com");
  await page.fill('[name="password"]', "secret");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/dashboard");
});
```

### 9.3 Testing Philosophy
- Test behavior, not implementation details
- Prefer `getByRole` and `getByText` over test IDs
- Mock only external dependencies (APIs, timers)
- Aim for high coverage on business logic, not UI details

---

## 10. Performance Optimization

### 10.1 Memoization
```tsx
const expensiveValue = useMemo(() => computeHeavy(data), [data]);
const stableCallback = useCallback(() => doSomething(id), [id]);
const MemoComponent = React.memo(MyComponent);
```

### 10.2 Code Splitting & Lazy Loading
```tsx
const Dashboard = React.lazy(() => import("./Dashboard"));

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

### 10.3 Other Techniques
- Virtualize long lists — `react-window` or `TanStack Virtual`
- Avoid unnecessary re-renders — check with React DevTools Profiler
- Debounce / throttle expensive event handlers
- Optimize images — use modern formats, lazy load
- Bundle analysis — `vite-bundle-visualizer`

---

## 11. Advanced React Patterns

### 11.1 Compound Components
```tsx
<Tabs>
  <Tabs.List>
    <Tabs.Tab>Tab 1</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel>Content 1</Tabs.Panel>
</Tabs>
```

### 11.2 Render Props
```tsx
<DataFetcher url="/api/users" render={(users) => <UserList users={users} />} />
```

### 11.3 Custom Hooks
Extract reusable stateful logic into `use*` functions:
```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}
```

### 11.4 Higher-Order Components (HOC)
```tsx
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Component {...props} /> : <Navigate to="/login" />;
  };
}
```

### 11.5 Context + Reducer Pattern
Combine `useContext` + `useReducer` for scalable shared state without external libraries.

---

## 12. Tooling & Build Systems

### 12.1 Scaffolding
- **Vite** — recommended, blazing fast HMR, great TypeScript support
- **Next.js** — full-stack, SSR/SSG, file-based routing
- **Create React App** — legacy, no longer recommended

### 12.2 Essential Dev Tools
- **ESLint** — catch code errors and bad patterns
- **Prettier** — consistent code formatting
- **TypeScript strict mode** — enable in `tsconfig.json` (`"strict": true`)
- **React DevTools** — inspect component tree and props
- **TanStack Query DevTools** — inspect cache state

### 12.3 `tsconfig.json` Key Settings
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

---

## 13. Architecture & Project Structure

A scalable feature-based structure:

```
src/
├── assets/          # images, fonts, static files
├── components/      # shared/reusable UI components
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       └── index.ts
├── features/        # feature modules (self-contained)
│   └── auth/
│       ├── components/
│       ├── hooks/
│       ├── api.ts
│       └── types.ts
├── hooks/           # app-wide custom hooks
├── lib/             # third-party configs (axios, queryClient)
├── pages/           # route-level components
├── store/           # global state
├── types/           # shared TypeScript types
└── utils/           # pure utility functions
```

### Key Principles
- Co-locate files by feature, not by type
- Keep components small and single-purpose
- Separate UI logic from business logic (custom hooks)
- Export types from a central `types/` directory
- Avoid prop drilling more than 2 levels deep — use context or state

---

## 14. Real-World Projects to Build

Build these in order of complexity to solidify your knowledge:

| # | Project | Key Skills Practiced |
|---|---------|---------------------|
| 1 | **Todo App** | State, events, lists, CRUD |
| 2 | **Weather App** | API fetching, async, error handling |
| 3 | **Expense Tracker** | Forms, charts, localStorage |
| 4 | **Movie Search App** | Debounce, pagination, URL params |
| 5 | **Auth + Dashboard** | Protected routes, JWT, context |
| 6 | **E-Commerce Store** | Cart state, Zustand, TanStack Query |
| 7 | **Full-Stack Blog** | Next.js, SSR, database, auth |
| 8 | **Real-Time Chat** | WebSockets, optimistic updates |

> **Rule:** Don't just follow tutorials. After each one, rebuild it from scratch without looking.

---

## 15. Resources

### Official Docs
- [React Documentation](https://react.dev) — the best starting point
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Router Docs](https://reactrouter.com)

### Courses & Books
- **Scrimba — React course** (interactive, free tier)
- **Total TypeScript** by Matt Pocock — best TypeScript deep-dive
- **Epic React** by Kent C. Dodds — advanced React patterns
- **"Learning React"** by Alex Banks & Eve Porcello (O'Reilly)

### Practice & Community
- [TypeScript Exercises](https://typescript-exercises.github.io)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)
- [Josh W. Comeau's Blog](https://www.joshwcomeau.com) — deep, visual React articles

---

## Learning Path Summary

```
Week 1–2   →  JavaScript ES6+ review + TypeScript basics
Week 3–4   →  React fundamentals + hooks
Week 5–6   →  TypeScript + React integration, forms, routing
Week 7–8   →  State management, data fetching (TanStack Query)
Week 9–10  →  Testing, performance, advanced patterns
Week 11–12 →  Build a full project end-to-end
Ongoing    →  Read source code, contribute to OSS, ship real apps
```

> The fastest way to expertise is deliberate practice on real problems — not passive consumption of tutorials. Build, break, debug, repeat.

---

*This guide is maintained in the [ReacAndTS](https://github.com/Danielaaron1111/ReacAndTS) repository.*
