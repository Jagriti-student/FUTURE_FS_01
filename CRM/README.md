# Customer Connect Hub — CRM

A production-ready CRM for managing website leads, follow-ups and conversions.

## Stack

- **Frontend**: React 19 + TanStack Start (Vite), Tailwind v4, shadcn/ui, Recharts
- **Backend**: Lovable Cloud (managed Postgres + Auth + serverless)
- **Auth**: Email/password (JWT sessions via Supabase Auth)
- **DB**: Postgres with Row-Level Security

## Features

- Admin authentication with protected dashboard routes
- Dashboard with KPI cards, pipeline chart, source chart, recent leads & upcoming follow-ups
- Full lead CRUD with status badges (New / Contacted / Converted)
- Searchable, filterable, sortable, paginated leads table
- Per-lead notes timeline (add / edit / delete)
- Follow-up scheduling with upcoming-reminders panel
- Responsive sidebar layout, mobile-friendly

## Data model

| Table        | Purpose                                       |
| ------------ | --------------------------------------------- |
| `leads`      | name, email, phone, company, source, status, follow_up_date, notes |
| `lead_notes` | per-lead activity log                         |
| `user_roles` | admin/user roles (extensible)                 |

## Demo account

Use **"Try with demo account"** on the sign-in screen. Credentials are visible below the button.

## Running locally

This project runs in Lovable — click **Publish** to deploy. All backend infrastructure (database, auth, secrets) is provisioned automatically by Lovable Cloud.
