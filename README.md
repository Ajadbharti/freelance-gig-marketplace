# GigNest: Freelance Gig Marketplace (Demo)

A frontend-only freelance marketplace built with Next.js (App Router), React, JavaScript and Tailwind CSS.
Clients browse gigs, place demo orders, request revisions and leave reviews. Freelancers publish gigs,
deliver work and track demo earnings.

## Run the project

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build check
```

Requires Node.js 18.18 or newer. Images use picsum.photos and pravatar.cc, so an internet connection is needed
to see them (a placeholder is shown if an image fails to load).

## Demo accounts

Password for every demo account: `demo123`

| Role       | Email                                                                  |
| ---------- | ---------------------------------------------------------------------- |
| Client     | rohan@demo.com, lisa@demo.com                                          |
| Freelancer | aarav@demo.com, sofia@demo.com, daniel@demo.com, priya@demo.com, emma@demo.com, kenji@demo.com |

You can also register your own client or freelancer account. Use "Reset demo data" in the footer to restore
the original sample data.

## What works

- Search, category, price and rating filters, sorting and "show more" on `/gigs` (state lives in the URL)
- Gig details, related gigs, freelancer profiles with portfolio and reviews
- Demo login and registration with validation and role selection
- Freelancer: create, edit and delete gigs, edit profile, deliver work, cancel orders
- Client: place orders, request revisions, approve work, cancel orders, leave one review per completed order
- Order status changes show up in both dashboards (shared state saved in LocalStorage)

## Project structure

```
src/
  app/          routes (App Router)
  components/   layout, gigs, freelancers, dashboard, orders, reviews, auth, ui
  context/      AuthContext (demo auth), MarketplaceContext (gigs, orders, reviews logic)
  data/         mock JSON-style data (categories, gigs, freelancers, users, orders, reviews)
  lib/          storage.js (LocalStorage helpers), utils.js, users.js
```

## Limitations (please read)

- **Mock data only.** There is no server and no database.
- **LocalStorage persistence.** Data exists only in the current browser on the current device. Clearing site
  data, using private mode or switching browsers resets or hides it. Two users on different devices never see
  each other's data.
- **Demo authentication is not secure.** Accounts and plain-text passwords are stored in LocalStorage. Never
  enter a real password. Role checks run in the browser and can be bypassed by editing LocalStorage.
- **No real payments, messaging, emails or notifications.** Prices and earnings are demo numbers.
- **No file uploads.** Delivery uses a link and a text note. Images are URLs.
- **Last write wins.** If the app is open in two tabs, the later save overwrites the earlier one.
- Account IDs for freelancers created in the browser are generated locally and are not globally unique.

## Moving to a real backend later

All business rules are in `MarketplaceContext.js` and `AuthContext.js`. Every action returns `{ ok, error }`,
so each function can be replaced with an API call without changing the UI:

1. Replace the `data/` files with a database and seed script.
2. Replace `AuthContext` with real authentication (hashed passwords, sessions or tokens).
3. Replace the LocalStorage reads and writes in the contexts with API requests (and move role checks to the server).
4. Add real file uploads and payments if needed.