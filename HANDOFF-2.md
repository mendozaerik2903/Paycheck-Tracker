# Paycheck Tracker — Project Handoff Summary

## Who You Are
Entry-level developer building a portfolio project to get hired at tech companies in Los Angeles. You want bite-sized, modular code with explanations of the *why* behind every decision. Your mentor should never write the whole app at once.

---

## Your Stack
- **React** (Vite)
- **Tailwind CSS** (v4, using the Vite plugin — `@tailwindcss/vite`)
- **Firebase** (Auth + Firestore — completed Week 2)
- **Recharts** (Week 3)
- **React Router DOM** (completed Week 2)
- **Deployment:** Vercel (Week 3)

---

## What We Built — Week 1 ✅

### Folder Structure
```
src/
├── components/
├── pages/
├── utils/
├── hooks/
├── firebase/
├── assets/
├── App.jsx
└── main.jsx
```

### Files Created

**`src/utils/paycheckMath.js`** — The math engine. Pure utility functions, zero side effects:
- `calculateGrossPay(hourlyWage, hoursWorked, overtimeMultiplier)` — handles CA overtime (40hr threshold)
- `calculateFederalTax(annualGross)` — 2024 marginal bracket calculation, scaled to bi-weekly
- `calculateCaliforniaStateTax(annualGross)` — 2024 CA brackets, scaled to bi-weekly
- `calculateFICATaxes(annualGross)` — Social Security (6.2%, $168,600 cap) + Medicare (1.45%)
- `calculateSDI(grossPay)` — California SDI flat 0.9% of gross pay per paycheck
- `calculatePaycheck({ hourlyWage, hoursWorked, overtimeMultiplier, preTaxDeductions, postTaxDeductions })` — master facade function, returns a clean results object

**`src/components/PaycheckForm.jsx`**
- Controlled inputs using a single `handleChange` handler with computed property keys
- Stores inputs as strings, parses to float only on submit
- Lifts state up via `onCalculate` prop — form does not own results
- Mobile responsive: `grid-cols-2` for wage/hours, `grid-cols-1 sm:grid-cols-3` for the bottom row
- `FormField` sub-component accepts a `type` prop with default `"number"` — handles both number and date inputs
- Added `payPeriodEnd` date field in Week 2

**`src/components/ResultsSummary.jsx`**
- Accepts props: `paycheckResults` and `meta`
- Displays all deduction line items with a `ResultRow` sub-component
- Conditionally renders pre/post-tax deductions only if `> 0`
- Uses `value.toFixed(2)` for clean dollar formatting
- Contains **Log Paycheck** button wired to Firestore via `logPaycheck()`
- Uses `useAuth()` to get `user.uid` directly

**`src/App.jsx`**
- Owns `paycheckResults` and `meta` state, both initialized to `null`
- `handleCalculate` bridges the form, math engine, and meta state
- Wrapped in `BrowserRouter` with `Routes` for `/`, `/signup`, `/login`, `/history`
- `/` and `/history` are wrapped in `ProtectedRoute`
- `<Navbar />` sits outside `<Routes>` and self-hides when user is logged out

---

## What We Built — Week 2 ✅

### New Files

**`src/firebase/config.js`**
- Initializes Firebase app with env vars via `import.meta.env.VITE_*`
- Exports `auth` and `db` as named exports
- Credentials stored in `.env` (gitignored) — never committed to GitHub

**`src/context/AuthContext.jsx`**
- `createContext` initialized with `{ user: null, loading: true }` (not `null`) to satisfy TypeScript
- `AuthProvider` uses `onAuthStateChanged` inside `useEffect` to sync Firebase auth state
- `loading` state prevents redirect flicker while Firebase checks existing session
- Cleanup function (`unsubscribe`) returned from `useEffect` to prevent memory leaks
- `useAuth()` custom hook wraps `useContext(AuthContext)` for clean one-line consumption

**`src/components/ProtectedRoute.jsx`**
- Returns `null` while `loading` is true (prevents false redirects before Firebase responds)
- Redirects to `/login` via `<Navigate />` if no user
- Renders `children` if authenticated

**`src/components/Navbar.jsx`**
- Uses `Link` from React Router for client-side navigation (no page refresh)
- Shows logout button only when `user` exists
- Returns `null` when logged out — hides itself on `/login` and `/signup`
- `signOut(auth)` + `navigate('/login')` on logout

**`src/pages/Signup.jsx`**
- Controlled form with `formData` state and single `handleChange` handler
- `createUserWithEmailAndPassword(auth, email, password)` on submit
- Redirects to `/` on success via `useNavigate`
- Shows Firebase error messages in UI via `error` state
- Redirects to `/` if already logged in via `if (user) return <Navigate to="/" />`

**`src/pages/Login.jsx`**
- Same pattern as Signup but uses `signInWithEmailAndPassword`
- Same redirect guards

**`src/pages/History.jsx`**
- Fetches paychecks on mount via `useEffect` + inner async function pattern
- Displays paychecks sorted newest first
- Empty state message when no paychecks logged yet

**`src/firebase/firestore.js`**
- `logPaycheck(userId, paycheckResults, meta)` — writes to `paychecks` collection using `addDoc` + `serverTimestamp()`
- `getPaychecks(userId)` — queries with `where` + `orderBy`, maps snapshot to plain JS objects
- Composite Firestore index created for `user_id` + `created_at` query

### `.env` file (gitignored)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Firestore Document Schema
```js
{
  id: "auto-generated",
  user_id: "auth.uid()",
  pay_period_end: "2026-06-15",
  hours_worked: 53.02,
  hourly_wage: 18.00,
  gross_amount: 1071.54,
  net_amount: 840.39,
  created_at: Timestamp
}
```

---

## Key Patterns Learned
- **Lifting state up** — form collects, parent owns, siblings display
- **Pure functions** — math engine has zero side effects, fully testable
- **Facade pattern** — `calculatePaycheck` is the single entry point for all math
- **Mobile-first responsive design** — Tailwind breakpoints (`sm:`, `md:`)
- **Separation of concerns** — math, UI, and state each live in their own layer
- **Auth context** — `createContext` + `useContext` + custom hook pattern
- **`onAuthStateChanged`** — Firebase listener pattern, always unsubscribe on unmount
- **Protected routes** — component wrapper pattern with `loading` guard
- **Firestore writes** — `addDoc`, `serverTimestamp`, collection references
- **Firestore reads** — `query`, `where`, `orderBy`, snapshot mapping
- **Async hooks pattern** — inner async function inside `useEffect` (can't make `useEffect` itself async)
- **Conditional rendering guards** — `if (!user) return null`, `if (user) return <Navigate />`
- **Hooks rule** — hooks always called at top of component, never after conditionals

---

## Known Limitations (Document in README)
- Tax estimates use 2024 marginal bracket liability, not employer W-4 withholding
- Assumes single filer, bi-weekly pay (26 periods/year)
- Results are within ~$2 of actual payroll for a standard part-time CA hourly worker
- Firestore rules in test mode — open read/write (acceptable for portfolio, lock down before production)

---

## Mentor Instructions (Carry These Forward)
- Give code in **bite-sized, modular pieces** — never the whole feature at once
- Always explain **why** the code is structured a certain way and what pattern is being used
- When debugging, explain the **root cause first**, then the fix
- Write **production-grade, readable** code — functional components, descriptive naming
- Ask the student to **attempt things first** before giving the answer
- When the student solves something better than the suggested approach, call it out explicitly

---

## Week 3 Goals — Charts + Deployment

1. **Income trend line chart** — last 6 months of gross pay using Recharts, rendered on `/history`
2. **Tax breakdown pie chart** — shows where each deduction dollar goes, rendered in `ResultsSummary`
3. **Demo account** — one-click login for recruiters, pre-populated with data
4. **Deploy to Vercel** — connect GitHub repo, set Firebase env vars in Vercel dashboard
5. **README.md** — project description, stack, limitations, and live link

---

## Where the Project Lives
- **Local:** `~/Desktop/Projects/Paycheck-Tracker`
- **Node version:** Must use Node `v20+` via `nvm` — run `nvm use 20` before starting
- **Dev server:** `npm run dev` → `localhost:5173`
- **GitHub:** Up to date as of end of Week 2
