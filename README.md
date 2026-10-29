# ABS Men's Salon website

The website for ABS Men's Salon, built with React, TypeScript, Vite, Tailwind CSS v4 and Motion.

## Run it locally

```bash
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173).

Other commands:

- `npm run build` builds the site into `dist/` for hosting.
- `npm run typecheck` checks the TypeScript.

## Admin panel

Go to `/admin` on the live site (for example `https://your-site.vercel.app/admin`) to edit the website without touching code:

- **Logo & hero**: logo, headline, hero background photo or video, corner labels
- **Homepage text**: booking button, the three cards, section headings
- **Services & prices**, **Reviews**, **Opening hours**, **Phone numbers**: add, edit, delete, reorder, show or hide
- **Gallery**: upload photos, add captions, reorder, hide or delete
- **Contact & location**: address, Google Maps link, WhatsApp booking number and message
- **Admins**: choose who can sign in and edit

Content is stored in Supabase (database, login and photo storage). The site shows built-in default content if the database can't be reached.

### First-time setup

1. In Supabase, open **Table Editor → admins** and insert a row with your email.
2. In Supabase, open **Authentication → URL Configuration** and set **Site URL** to your live site address.
3. Open `/admin`, click **First time? Create account**, use the same email, confirm it from your inbox, then sign in.

## Where to change things in code

- **Default content and data loading**: `src/lib/content.ts`
- **Supabase connection**: `src/lib/supabase.ts` (or set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`)
- **Admin panel**: `src/admin/`
- **Logo files**: the official logo is `public/abs-logo.png`; the site uses the web-optimised copies `public/abs-logo.webp` and `public/abs-logo-small.webp`
- **Colours and fonts**: the `@theme` block in `src/index.css`

## Design guidelines

`.claude/skills/ui-ux-pro-max` is the UI UX Pro Max skill (MIT licence) that the design follows.
