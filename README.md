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
| `mobile/` | Expo / React Native starter (see `mobile/README.md`) |

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
(project "Skynova Agency's Project", EU region). Visitors can only insert; read the sign-ups in the Supabase
dashboard (Table editor → `mova_signups`) or export them as CSV. Override the project with `VITE_SUPABASE_URL` /
`VITE_SUPABASE_KEY` (publishable key) at build time if needed.

## Demo data

All places, prices, drivers and trips live in `src/lib/demo-data.ts`. Prices use straight-line distance × 1.35 and an example tariff; they are not real quotes.
