# Finance Dashboard

A personal finance app built with the MERN stack. The plan is to let users connect their bank account via Plaid, automatically pull in transactions, set monthly budgets per category, and track savings goals — all in one dashboard.

## Planned features

- [ ] User auth — register and login with JWT
- [ ] Bank sync — link accounts via Plaid and pull transaction history
- [ ] Budgets — set monthly spending limits per category
- [ ] Goals — create savings goals and track progress
- [ ] Analytics — charts for spending trends and category breakdowns
- [ ] Deployment — Render (API), Vercel (frontend), MongoDB Atlas (database)

## Planned stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React, Vite, Tailwind CSS     |
| State    | Redux Toolkit                 |
| Backend  | Node.js, Express              |
| Database | MongoDB + Mongoose            |
| Auth     | JWT (access + refresh tokens) |
| Bank API | Plaid                         |
| Charts   | Recharts                      |
