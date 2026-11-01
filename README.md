# MOVA · Besançon (prototype)

Site vitrine et prototype interactif pour MOVA, un concept de plateforme VTC locale à Besançon.

> **Pre-launch.** No booking, payment, driver, SMS or verification is real; only waitlist sign-ups are stored. Keep the demo notices and never collect ID or insurance documents through this site.

## Stack

- React 18 + TypeScript + Vite (multi-page)
- Tailwind CSS with shadcn-style theme tokens
- UI built from [21st.dev](https://21st.dev) components, adapted to MOVA:
  - `efferd/header-1` → `src/components/ui/header-1.tsx` (+ `button`, `menu-toggle-icon`, `use-scroll`)
  - `ravikatiyar162/ride-booking-form` → `src/components/ui/ride-booking-form.tsx`
  - `shadcnui-blocks/features-01` → `src/components/ui/features-01.tsx`
  - `ddoemonn/accordion` → `src/components/ui/accordion.tsx`
  - `meschacirung/footer` → `src/components/ui/footer.tsx`

## Pages

| Path | Content |
| --- | --- |
| `/` (`index.html`) | Landing page: fictitious quote form, how it works, Besançon use cases, verification mock-up (demo code `123456`), passenger waitlist and driver interest form (stored in Supabase), FAQ |
| `/app.html` | Interactive phone prototype: rider ↔ driver toggle, simulated match, accept/refuse, trip states |
| `/mentions-legales.html` | Legal notice placeholder, to complete before going public |
| `mobile/` | Pilot passenger and driver app, Expo / React Native (see `mobile/README.md`) |

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs static files to dist/
npm run preview
```

`dist/` is plain static HTML/JS/CSS and can be hosted anywhere.

## Hosting (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.
One-time setup: in the repo go to **Settings → Pages → Build and deployment → Source** and pick **GitHub Actions**.
The site is then served at `https://skynovaagency1-web.github.io/Mova/`. A custom domain can be added on the same settings page.

## Waitlist sign-ups

The passenger waitlist and driver interest forms insert rows into the Supabase table `public.mova_signups`
(organization "MOVA", project "Mova", EU region). Visitors can only insert. The database schema lives in
`supabase/migrations/`. Override the project with `VITE_SUPABASE_URL` / `VITE_SUPABASE_KEY` (publishable key)
at build time if needed.

## Ops console (`/ops/`)

Private staff console for the sign-ups: overview, passenger and driver lists, candidate status, notes, CSV export.
Access requires a Supabase Auth account, a TOTP authenticator app (enrolled on first login) and a row in
`public.mova_staff`. Row level security enforces both, so the page itself holds no data. The page is `noindex`.

Add a staff member: create the user in Supabase (Authentication → Users → Add user, auto-confirm), then run
`insert into public.mova_staff (user_id) select id from auth.users where email = '...';`

## Pilot app (`mobile/`)

Expo app for passengers and drivers on the same Supabase project. See `mobile/README.md`.

## Demo data

All places, prices, drivers and trips live in `src/lib/demo-data.ts`. Prices use straight-line distance × 1.35 and an example tariff; they are not real quotes.
