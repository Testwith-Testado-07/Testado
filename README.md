# Testado

**Testado** is a product-testing marketplace that connects product owners (businesses) with testers (consumers). Owners publish campaigns; testers browse active campaigns, apply, and get accepted or rejected. Built with **Next.js 16**, **Supabase**, **TypeScript**, and **Tailwind CSS v4**.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Set up Supabase](#2-set-up-supabase)
  - [3. Configure environment variables](#3-configure-environment-variables)
  - [4. Install dependencies](#4-install-dependencies)
  - [5. Run the development server](#5-run-the-development-server)
- [Database Migrations](#database-migrations)
- [Environment Variables Reference](#environment-variables-reference)
- [Project Routes](#project-routes)
- [Contributing](#contributing)

---

## Project Structure

```
Testado/
├── backend/
│   ├── migrations/          # SQL migrations (apply in order)
│   │   ├── 01_rbac_security_policies.sql
│   │   ├── 02_todos_table.sql
│   │   ├── 03_clients_table.sql
│   │   ├── 04_todos_enhancements.sql
│   │   ├── 05_profiles_enhancements.sql
│   │   └── 06_product_testing_marketplace.sql
│   └── README.md
└── frontend/
    ├── public/              # Static assets
    ├── src/
    │   ├── app/             # Next.js App Router pages & layouts
    │   │   ├── (dashboard)/ # Role-gated dashboard layouts
    │   │   │   ├── owner/   # Business/owner dashboard
    │   │   │   └── tester/  # Tester dashboard
    │   │   ├── auth/        # Sign in / Sign up pages
    │   │   ├── businesses/  # Business landing page
    │   │   ├── clients/     # Client management
    │   │   ├── onboarding/  # Post-signup onboarding flow
    │   │   ├── profile/     # User profile page
    │   │   ├── testers/     # Tester landing page
    │   │   ├── about/       # About page
    │   │   ├── contact/     # Contact page
    │   │   ├── why-testado/ # Why Testado page
    │   │   └── api/         # Next.js API routes (email, etc.)
    │   ├── components/      # Shared UI components
    │   └── utils/           # Helpers, Supabase client, Zod schemas
    ├── .env.example         # Environment variable template
    ├── next.config.ts
    ├── package.json
    └── tsconfig.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + Vanilla CSS |
| Database | [Supabase](https://supabase.com) (Postgres + RLS) |
| Auth | Supabase Auth (email/password) |
| Email | [Resend](https://resend.com) + [EmailJS](https://www.emailjs.com) |
| Animations | [Motion](https://motion.dev) (Framer Motion successor) |
| Validation | [Zod](https://zod.dev) |

---

## Features

- 🔐 **Role-based authentication** — `owner` (business) and `tester` (consumer) roles, enforced at the DB level with Postgres RLS policies
- 📋 **Campaign management** — Owners create, publish, pause, and archive testing campaigns
- 🎯 **Campaign marketplace** — Testers browse active campaigns filtered by their country and age range
- 📝 **Applications** — Testers apply to campaigns; owners accept or reject applicants
- 👤 **Profiles & onboarding** — Guided post-signup flow that captures role-specific data
- 📬 **Transactional email** — Welcome emails, business enquiries, and tester application notifications via Resend and EmailJS
- 🛡️ **Secure by default** — All database tables have Row Level Security enabled

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm / yarn / bun)
- A **[Supabase](https://supabase.com)** project (free tier works)
- A **[Resend](https://resend.com)** account (for server-side emails)
- An **[EmailJS](https://www.emailjs.com)** account (for client-side emails)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Testwith-Testado-07/Testado.git
cd Testado
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Apply the database migrations (see [Database Migrations](#database-migrations) below).

### 3. Configure environment variables

```bash
cd frontend
cp .env.example .env.local
```

Open `.env.local` and fill in every value. See [Environment Variables Reference](#environment-variables-reference) for details.

### 4. Install dependencies

```bash
# from the frontend/ directory
npm install
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app hot-reloads on file changes.

---

## Database Migrations

All SQL lives in `backend/migrations/`. Apply them **in numeric order**, once per Supabase project, using the **Supabase Dashboard → SQL Editor**:

| File | What it does |
|---|---|
| `01_rbac_security_policies.sql` | Creates `profiles`, `campaigns`, `submissions` tables; sets up RBAC functions and RLS policies; installs trigger to auto-create profile on signup |
| `02_todos_table.sql` | Adds a todos/tasks table |
| `03_clients_table.sql` | Adds a clients table for owner accounts |
| `04_todos_enhancements.sql` | Enhances the todos table with extra fields |
| `05_profiles_enhancements.sql` | Adds targeting fields (country, age range) to profiles |
| `06_product_testing_marketplace.sql` | Adds `campaign_applications` table, application-limit checks, and marketplace RLS policies |

> **Important:** Apply migrations in order (01 → 06). Do **not** re-run `01` as a substitute for later migrations — each migration is designed to be applied once and is idempotent where possible.

After applying all migrations, verify that `public.campaign_applications` is exposed to the `authenticated` role under **Project Settings → API → Exposed schemas**.

---

## Environment Variables Reference

Copy `frontend/.env.example` to `frontend/.env.local` and fill in the following:

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your [Resend](https://resend.com) API key for server-side email |
| `BUSINESS_REQUEST_TO_EMAIL` | Comma-separated recipient email(s) for business enquiries |
| `BUSINESS_REQUEST_FROM_EMAIL` | Sender address (must be on a verified Resend domain in production) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID` | EmailJS welcome email template |
| `NEXT_PUBLIC_EMAILJS_BUSINESS_TEMPLATE_ID` | EmailJS business enquiry template |
| `NEXT_PUBLIC_EMAILJS_TESTER_TEMPLATE_ID` | EmailJS tester application template |
| `NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID` | EmailJS contact form template |

---

## Project Routes

| Route | Description | Access |
|---|---|---|
| `/` | Marketing homepage | Public |
| `/about` | About Testado | Public |
| `/why-testado` | Why use Testado | Public |
| `/businesses` | Landing page for businesses | Public |
| `/testers` | Landing page for testers | Public |
| `/contact` | Contact form | Public |
| `/auth` | Sign in / Sign up | Public |
| `/onboarding` | Post-signup role + profile setup | Authenticated |
| `/profile` | View / edit your profile | Authenticated |
| `/dashboard/owner` | Owner campaign dashboard | Owner role |
| `/dashboard/tester` | Tester campaign marketplace | Tester role |
| `/clients` | Client management | Owner role |

---

## Contributing

1. Fork the repo and create a branch from `main`.
2. Make your changes inside the `frontend/` directory (Next.js) or `backend/migrations/` (SQL).
3. Ensure `npm run lint` passes before opening a PR.
4. Open a pull request with a clear description of what changed and why.

---

> Payments, tester payouts, and feedback submission are not yet implemented. Campaign reward values are estimates and do not represent escrowed funds.
