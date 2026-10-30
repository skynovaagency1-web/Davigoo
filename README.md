# MOVA · Besançon (prototype)

Site vitrine et prototype interactif pour MOVA, un concept de plateforme VTC locale à Besançon.

> **Prototype only.** No booking, payment, driver, SMS or verification is real. Keep the "prototype / démo" notices on any public demo and never collect real ID or insurance documents through this site.

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
| `/` (`index.html`) | Landing page: fictitious quote form, how it works, Besançon use cases, verification mock-up (demo code `123456`), driver interest form (nothing sent), FAQ |
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

`dist/` is plain static HTML/JS/CSS and can be hosted anywhere (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Demo data

All places, prices, drivers and trips live in `src/lib/demo-data.ts`. Prices use straight-line distance × 1.35 and an example tariff; they are not real quotes.
