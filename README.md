# Marketplace

A mini Facebook-style marketplace. Browse listings, post your own with a photo, and message sellers. Built with React 19, Next.js 16, Supabase (Postgres + Storage), Tailwind CSS 4, and shadcn/ui.

## Live demo

- Production: _added after deployment_
- Repository: _added after publication_

## Features

- **Create a listing** — upload a photo (JPEG/PNG/WebP/GIF, up to 5 MB) and enter title, description, price, email, and category. Saved in Supabase (Postgres + Storage).
- **Browse & search** — grid or list view with category tabs and live text search.
- **Listing detail page** — large image, full details, seller info, and a "Message Seller" button.
- **Message seller** — saves the buyer's message (and email) in Supabase.
- **Responsive** — mobile-first layout with a sticky top bar.
- **Accessible** — labelled controls, keyboard navigation, focus rings, reduced-motion support.

## Stack

React 19 · Next.js 16 (App Router) · Supabase (Postgres, Storage, RLS) · Tailwind CSS 4 · shadcn/ui (base-nova) · TypeScript

## Getting started

```bash
npm install
cp .env.example .env.local
```

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL editor.
3. Create a public storage bucket named `listing-images` (the schema does this).
4. Copy Project URL and anon public key from Project Settings → API.

`.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Run

```bash
npm run dev
```

## Project structure

```
src/
  app/                  layout, home (browse), sell, listing/[id]
  components/
    ui/                 shadcn/ui
    marketplace/        top bar, category tabs, listing card, view toggle, icons
  lib/
    categories.ts       category list + icons
    marketplace.ts      types, queries, storage upload, validation
    supabase.ts         browser client
supabase/schema.sql     listings + messages + storage + RLS
```

## Database

- `listings` — id, title, description, price, email, category, image_path, created_at
- `messages` — id, listing_id (FK), buyer_email, message, created_at
- Storage bucket `listing-images` (public) with anon upload/read policies.

## Deployment (Vercel)

1. Push to GitHub.
2. Import on [vercel.com/new](https://vercel.com/new).
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
4. Deploy.

## Notes

- No authentication by design; anyone can create a listing and message a seller.
- Images are stored in Supabase Storage (public bucket).
- The `messages` table allows insert only (no anon read) — sellers view messages via the Supabase dashboard, or a future inbox page.
- Reduced motion is respected.

## Built for

CapM / Semprove — Test 3: Marketplace (React, Next.js, Supabase).
Previous tests: Tic-Tac-Toe, My Wall.
