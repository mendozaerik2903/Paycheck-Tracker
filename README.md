# Paycheck Tracker

A budgeting web app for hourly workers to log their paychecks and split their take-home pay into Needs, Wants, and Savings.

## Live Demo

> Coming soon (deploying to Vercel)

**Demo account:** `demo@paychecktracker.com` / `demo123`

---

## What It Does

Most budgeting apps start with your gross income — but hourly workers think in paychecks. Paycheck Tracker lets you log what you actually received, then split it intentionally.

1. **Log a paycheck** — enter your net pay and pay period end date
2. **Set your split** — use sliders to allocate percentages to Save, Needs, and Wants
3. **Track your spending** — add line items to Needs and Wants to see how much of each bucket you've used
4. **See your trend** — an income chart shows your earnings over time

---

## Features

- **Paycheck list** — all logged paychecks, newest first, with a running income trend chart
- **Budget splitter** — Save slider removes from net pay first; Needs and Wants split the remainder; percentages persist between sessions
- **Line items** — add named expenses to Needs and Wants buckets; running totals show how much is left
- **Tax calculator** — optional tool to estimate your California take-home before you receive a paycheck (2024 brackets, single filer, bi-weekly)
- **Demo account** — one-click login for recruiters with pre-populated data
- **Auth** — email/password login with protected routes

---

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| Auth | Firebase Authentication |
| Database | Firestore |
| Charts | Recharts |
| Routing | React Router DOM |
| Deployment | Vercel |

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/paycheck-tracker.git
cd paycheck-tracker

# Install dependencies
npm install

# Create a .env file with your Firebase credentials
cp .env.example .env
# Fill in your Firebase project values

# Start the dev server
npm run dev
```

### Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Limitations

- Tax estimates are based on 2024 marginal bracket liability, not employer W-4 withholding
- Assumes single filer, bi-weekly pay period (26 periods/year)
- California state taxes only
- Results are within ~$2 of actual payroll for a standard part-time CA hourly worker
- Firestore security rules are currently in test mode

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── PaycheckForm.jsx
│   ├── ProtectedRoute.jsx
│   └── ResultsSummary.jsx
├── context/
│   └── AuthContext.jsx
├── firebase/
│   ├── config.js
│   └── firestore.js
├── pages/
│   ├── Budget.jsx
│   ├── History.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── utils/
│   └── paycheckMath.js
├── App.jsx
└── main.jsx
```

---

## Author

Built by Erik as a portfolio project.
