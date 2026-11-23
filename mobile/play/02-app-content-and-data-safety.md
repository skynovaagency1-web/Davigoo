# Play Console → App content & Data safety — DaviGoo

Every answer below comes from the code: `worker/schema.sql` for what is stored,
`mobile/app.json` for permissions, `mobile/src/` for how they are used. Where
something depends on a business fact I cannot read, it is marked **DECIDE**.

> This app is a different shape from the Skynova and Davinova listings. It
> collects **precise location** and **shares it between users**, which is the
> single heaviest thing on this form. Answer it honestly: a ride-hailing app
> that under-declares location is the classic Play takedown.

---

## ⚠️ Add before this section will pass

Play requires a **publicly reachable URL** where users can request account and
data deletion, in addition to the in-app route — reachable without signing in.

In-app deletion already exists (Compte → Supprimer mon compte, `api.ts`
`deleteAccount()`). The web URL does not. None of the site's pages cover it:

```
404 · app · cgu · chauffeurs · comment-ca-marche · confidentialite
faq · index · mentions-legales · reinitialiser · securite · trajets
```

A `suppression-compte.html` alongside `confidentialite.html`, in French,
saying what is erased and how to ask, satisfies it.

---

## App access

> **All functionality is available without special access** — ❌ not true here.

The app is sign-in only: a passenger cannot request a ride and a driver cannot
go online without an account. So you must **provide test credentials**:

- one **passenger** account
- one **driver** account that staff have already approved (`drivers.approved = 1`)

An unapproved driver account shows only the waiting screen, and a reviewer who
gets that will reject the build as broken. Approve the test driver in the ops
console before submitting.

---

## Ads

> **No, my app does not contain ads.**

---

## Content rating questionnaire (IARC)

| Question | Answer |
|---|---|
| Category | Reference, News, or Educational |
| Violence / sexuality / profanity / drugs / gambling | No |
| Users can interact or communicate with each other | **Yes** — passenger and driver are matched and each sees the other's details |
| **App shares the user's current location with other users** | **Yes** — see below |
| Purchase of digital goods | No |
| User-generated content shared publicly | No — a driver photo is shown only to the matched passenger |

**The location answer is Yes and must stay Yes.** `rides` stores
`pickup_lat/lng` and `dropoff_lat/lng`, and during a ride
`driver_lat/lng/heading` are written every few seconds
(`useShareLocation.ts`, `watchPositionAsync`, 4s / 15m). The driver sees the
passenger's pick-up point; the passenger sees the driver approaching. That is
location shared between users, which is the whole product.

---

## Target audience

| Field | Answer |
|---|---|
| Target age groups | **18 and over** |
| Appeals to children | No |

---

## Other declarations

| Section | Answer |
|---|---|
| News app | No |
| Government app | No |
| Health apps | No |
| **Financial features** | **None of these** — the pilot takes no payment. `rides.price_estimate` is a displayed estimate only. **DECIDE:** this changes the moment you take money in-app. |
| Data safety | below |

---

# Data safety form

**Encrypted in transit:** Yes — HTTPS only, Cloudflare Worker.
**Users can request deletion:** Yes — in-app, plus the URL above once it exists.

## 1. Location → Precise location
| | |
|---|---|
| Collected | **Yes** |
| Shared | **Yes** — with the other party to the ride |
| Required | Required |
| Purposes | App functionality |

Pick-up and drop-off coordinates, and the driver's live position during a ride.
`expo-location` is requested **when-in-use only** — there is no
`requestBackgroundPermissionsAsync` anywhere, so do **not** tick background
location. That keeps you out of Play's background-location review, which needs
a written declaration and a demo video.

> **Product note, not a Play one:** foreground-only means a driver who switches
> apps or locks the phone stops sending position. For a pilot that may be fine.
> At scale it is the thing drivers will complain about, and fixing it means
> background location and that heavier review.

## 2. Personal info → Email address
Collected · Not shared · Required · Account management, App functionality

`users.email`, unique, used to sign in.

## 3. Personal info → Name
Collected · **Shared** · Required · App functionality

`profiles.first_name`. The passenger sees the driver's first name and vice
versa, so this is shared between users.

## 4. Personal info → Phone number
Collected · **Shared** · Optional · App functionality

`profiles.phone`, nullable. Shared so the two can reach each other.

## 5. Photos and videos → Photos
Collected · **Shared** · Optional · App functionality

The driver photo (`drivers.photo_path`, R2 bucket `mova-driver-photos`), taken
with the camera or chosen from the gallery via `expo-image-picker`, shown to
the matched passenger so they can identify the car. `microphonePermission` is
explicitly `false` in app.json — good, it keeps the mic permission off the
manifest.

## 6. App activity → Other actions
Collected · Not shared · Required · App functionality, Analytics

Ride history: status, timestamps, distance, duration, estimate.

## 7. Personal info → Other info
Collected · Not shared · Optional · App functionality

The waitlist (`signups`): first name, email, phone, commune, free-text details,
`has_vtc_card`. Collected on the website rather than in the app — declare it if
the same account system backs both.

## Declare as NOT collected
Financial info · Health and fitness · Messages · Audio files · Files and docs ·
Calendar · Contacts · Search history · Installed apps · Web browsing history ·
Purchase history · Device or other IDs

`push_subscriptions` stores an endpoint and nothing else — no user id, no
device id — so it adds nothing here.

---

## Two things specific to a VTC app in France

**DECIDE — licensing.** Play's Other Financial / transport-adjacent reviews
sometimes ask ride-hailing apps for proof the operator may legally run the
service. In France that is VTC registration (registre des VTC) for the operator
and a carte VTC per driver — the website already asks drivers
`has_vtc_card`, so the concept is in the product. Have the registration to hand.

**DECIDE — is the pilot live?** An app that matches real passengers with real
drivers is reviewed more carefully than a demo. If it is not yet operating,
saying so in the listing ("pilote à Besançon, ouverture prochaine") is both
true and lowers the stakes. If it is operating, expect the licensing question.

I cannot read either of these from the code — they are yours to answer.
