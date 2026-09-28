# Testado Backend & Database Architecture

This directory houses the backend database schema, migrations, and Row Level Security (RLS) policies for **Testado**.

## Structure

```
backend/
├── migrations/
│   └── 01_rbac_security_policies.sql  # Core RBAC schema, enum types, tables, and RLS policies
└── README.md
```

## RBAC Security Model

### User Roles
- **`owner`**: Can create campaigns, edit/delete their own campaigns, and view tester submissions for their campaigns.
- **`tester`**: Can view active campaigns, submit test reports/feedback, and only view/insert their own submissions.

### How to Apply the Migration

#### Option A: Supabase Dashboard SQL Editor
1. Open your Supabase Project Dashboard.
2. Navigate to the **SQL Editor**.
3. Copy and paste the contents of `backend/migrations/01_rbac_security_policies.sql`.
4. Click **Run**.


## Integration with Next.js App

The Next.js frontend interacts with this backend via:
- **`src/middleware.ts`**: Checks `auth.users` and queries `profiles.role` to restrict route access between `/owner` and `/tester`.
- **`@supabase/ssr`**: Synchronizes session cookies across client and server requests.
