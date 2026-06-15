# Paycheck Tracker — Project Handoff Summary

## Who You Are
Entry-level developer building a portfolio project to get hired at tech companies in Los Angeles. You want bite-sized, modular code with explanations of the *why* behind every decision. Your mentor should never write the whole app at once.

---

## Your Stack
- **React** (Vite)
- **Tailwind CSS** (v4, using the Vite plugin — `@tailwindcss/vite`)
- **Firebase** (Week 2)
- **Recharts** (Week 3)
- **React Router DOM** (Week 2)
- **Deployment:** Vercel

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

**`src/components/ResultsSummary.jsx`**
- Accepts one prop: `paycheckResults`
- Displays all deduction line items with a `ResultRow` sub-component
- Conditionally renders pre/post-tax deductions only if `> 0`
- Uses `value.toFixed(2)` for clean dollar formatting

**`src/App.jsx`**
- Owns `paycheckResults` state, initialized to `null`
- `handleCalculate` bridges the form and the math engine
- Conditionally renders `<ResultsSummary />` only when results exist
- Clean, lean — no business logic lives here

---

## Key Patterns Learned
- **Lifting state up** — form collects, parent owns, siblings display
- **Pure functions** — math engine has zero side effects, fully testable
- **Facade pattern** — `calculatePaycheck` is the single entry point for all math
- **Mobile-first responsive design** — Tailwind breakpoints (`sm:`, `md:`)
- **Separation of concerns** — math, UI, and state each live in their own layer

---

## Known Limitations (Document in README)
- Tax estimates use 2024 marginal bracket liability, not employer W-4 withholding
- Assumes single filer, bi-weekly pay (26 periods/year)
- Results are within ~$2 of actual payroll for a standard part-time CA hourly worker

---

## Week 2 Goals — Firebase Auth + Firestore

### Mentor Instructions (Carry These Forward)
- Give code in **bite-sized, modular pieces** — never the whole feature at once
- Always explain **why** the code is structured a certain way and what pattern is being used
- When debugging, explain the **root cause first**, then the fix
- Write **production-grade, readable** code — functional components, descriptive naming
- Ask the student to **attempt things first** before giving the answer

### What to Build Next
1. **Firebase project setup** — create project on Firebase console, wire up `src/firebase/config.js`
2. **Email/password auth** — signup and login pages under `src/pages/`
3. **Auth context** — `useContext` + `useReducer` so any component knows the current user
4. **Protected routes** — redirect to login if not authenticated, using React Router DOM
5. **"Log Paycheck" button** — saves the results object to Firestore under the user's UID
6. **Paycheck history** — fetch and display past paychecks from Firestore in a list

### Firestore Document Schema
```js
{
  id: "uuid",
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

## Week 3 Goals — Charts + Deployment

1. **Income trend line chart** — last 6 months of gross pay using Recharts
2. **Tax breakdown pie chart** — shows where each deduction dollar goes
3. **Demo account** — one-click login for recruiters, pre-populated with data
4. **Deploy to Vercel** — connect GitHub repo, set Firebase env vars in Vercel dashboard
5. **README.md** — project description, stack, limitations, and live link

---

## Where the Project Lives
- **Local:** `~/Desktop/Projects/Paycheck-Tracker`
- **Node version:** Must use Node `v20+` via `nvm` — run `nvm use 20` before starting
- **Dev server:** `npm run dev` → `localhost:5173`
- **GitHub:** Push before starting Week 2
