# MOVA app (pilot)

One Expo / React Native codebase for both apps. The account's role picks the experience:

- **Passenger:** choose pick-up and drop-off (pilot list of Besançon places), see the estimate, request a ride, follow its status, cancel.
- **Driver:** register vehicle, wait for MOVA validation, go online, see open requests, accept, then "en route" → "passager à bord" → "terminer".

Sign-in uses e-mail + password (Supabase Auth, "Confirm email" turned off for the pilot because the project has no custom e-mail service yet). There is no payment, map or live GPS yet; those come in the next steps.

## Run it on your phone

1. Install Node.js 20+ and the **Expo Go** app on your phone.
2. In this folder: `npm install`, then `npx expo start`.
3. Scan the QR code with the camera (iPhone) or Expo Go (Android).

## Backend

Uses the same Supabase project as the website (`src/config.ts`, overridable with `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_KEY`).
The schema is in `../supabase/migrations/` (`20261103_mova_rides_v1.sql` for the app). All ride changes go through database
functions (`mova_request_ride`, `mova_accept_ride`, `mova_advance_ride`, `mova_cancel_ride`) that enforce who may do what;
prices are computed in the database. Drivers are validated by staff in the ops console (`/ops/`).


## Checks

`npm run typecheck`
