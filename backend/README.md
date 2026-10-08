# Testado Backend & Database Architecture

This directory houses the backend database schema, migrations, and Row Level Security (RLS) policies for **Testado**.

## Structure

```
backend/
├── migrations/
│   ├── 01_rbac_security_policies.sql
│   ├── 02_todos_table.sql
│   ├── 03_clients_table.sql
│   ├── 04_todos_enhancements.sql
│   ├── 05_profiles_enhancements.sql
│   └── 06_product_testing_marketplace.sql
└── README.md
```

## Product Testing Flow

1. A product owner publishes an active campaign.
2. Testers see active campaigns matching their saved country and age range, then apply.
3. The campaign owner accepts or rejects each application.

The current flow tracks campaign applications only. Feedback submission forms, reward balances, escrow, and payouts are not connected yet.

The marketplace schema, profile targeting fields, application table, row-level policies, and application-limit checks are in [06_product_testing_marketplace.sql](./migrations/06_product_testing_marketplace.sql).

## Applying Migrations

Apply the SQL files in numeric order, once per Supabase project, using the Supabase Dashboard SQL Editor or your established database migration workflow. For an existing project that has migrations 01–05 applied, apply migration 06 next. Do not rerun migration 01 as a substitute for applying later migrations.

The frontend requires migration 06 before publishing campaigns, loading tester applications, or completing onboarding. If the campaign-application table is not exposed through the Data API in project settings, expose `public.campaign_applications` to the `authenticated` role; the migration enables RLS and grants only the table operations needed by the UI.

Payments and tester payouts are not implemented. Campaign reward values are estimates and do not represent escrowed funds or completed payments.

## Integration with Next.js App

The Next.js frontend interacts with this backend via:
- **`frontend/src/middleware.ts`**: Checks the signed-in profile role for protected dashboard routes.
- **`@supabase/ssr`**: Synchronizes session cookies across client and server requests.
