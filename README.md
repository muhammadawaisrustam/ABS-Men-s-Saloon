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

## Where to change things

- **Business details** (phone, WhatsApp number, address, prices, hours, reviews): `src/data.ts`
- **Logo**: the official logo is `public/abs-logo.png`; the site uses the web-optimised copies `public/abs-logo.webp` and `public/abs-logo-small.webp` (shown by `src/components/AbsLogo.tsx`)
- **Hero video**: add a file at `public/hero.mp4` and it plays in the hero automatically. Without it, the hero shows the logo.
- **Colours and fonts**: the `@theme` block in `src/index.css`

## Design guidelines

`.claude/skills/ui-ux-pro-max` is the UI UX Pro Max skill (MIT licence) that the design follows.
