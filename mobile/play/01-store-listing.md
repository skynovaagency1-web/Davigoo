# Google Play store listing — DaviGoo

French is the primary language: the app, the site and the pilot are all in
Besançon. An English listing is optional and can come later.

Limits: **title 30**, **short description 80**, **full description 4000**.

---

## App title (30 max)

```
DaviGoo · VTC Besançon
```

## Short description — Français (80 max)

```
Réservez un chauffeur VTC à Besançon. Prix annoncé à l'avance, sans surprise.
```

## Full description — Français (4000 max)

```
DaviGoo, le VTC de Besançon.

Un chauffeur près de chez vous, un prix annoncé avant de partir, et une équipe locale que vous pouvez joindre.

COMMANDER UNE COURSE

• Choisissez votre point de départ et votre destination
• Le prix s'affiche avant la demande — pas de surprise à l'arrivée
• Suivez votre chauffeur qui approche, en direct
• Standard, Confort ou Van selon vos besoins
• Annulez tant que personne n'a accepté

DES CHAUFFEURS VÉRIFIÉS

Chaque chauffeur est rencontré par l'équipe DaviGoo avant sa première course. Sa photo, son véhicule et sa plaque s'affichent dès qu'il accepte, pour que vous montiez dans la bonne voiture.

VOUS ÊTES CHAUFFEUR VTC ?

L'application est la même : créez votre compte en mode chauffeur, enregistrez votre véhicule, et passez en ligne une fois votre dossier validé par l'équipe. Les courses proches s'affichent, vous acceptez celles qui vous conviennent.

LE PILOTE

DaviGoo démarre à Besançon. Les trajets se font entre les lieux de la liste du pilote, et le paiement se règle directement avec le chauffeur — l'application ne prend pas de paiement pour l'instant.

VOS DONNÉES

• Votre position sert à proposer votre adresse de départ et à suivre la course. Elle n'est utilisée que pendant que l'application est ouverte.
• Votre prénom et votre téléphone ne sont partagés qu'avec le chauffeur de votre course, et seulement le temps de celle-ci.
• Aucune publicité, aucune revente de données.
• Vous pouvez supprimer votre compte à tout moment depuis Compte → Supprimer mon compte.

Une question ? L'équipe répond depuis davigoo.com.
```

> **Before publishing:** if the pilot is not yet carrying passengers, say so in
> the first line — "Pilote à Besançon, ouverture prochaine." It is true, it
> sets expectations, and it makes the Play review easier.

---

## Short description — English (80 max), optional

```
Book a private-hire driver in Besançon. Price agreed upfront, no surprises.
```

---

## Categorisation

| Field | Value |
|---|---|
| App or game | **App** |
| Category | **Maps & Navigation**, or **Travel & Local** |
| Tags | VTC · chauffeur · transport · Besançon |
| Website | `https://davigoo.com` |
| Privacy policy | `https://davigoo.com/confidentialite.html` |
| Price | Free |
| Contains ads | No |
| In-app purchases | No — the pilot takes no payment |

**DECIDE — category.** Maps & Navigation is where riders look for this kind of
app; Travel & Local is broader and less competitive. Either is defensible.

---

## Graphics

| Asset | Spec | Status |
|---|---|---|
| App icon | 512×512 PNG, no alpha | from `assets/icon.png` — check it has no alpha |
| Feature graphic | 1024×500 PNG, no alpha | **not made** |
| Phone screenshots | 2–8, min 1080px | **not made** |

Unlike the Skynova and Davinova listings, these could not be generated here.
Those are websites and could be rendered headlessly; this is a native app, and
a real screenshot needs a device or emulator.

Capture them from a `preview` build (see `../EAS.md`) on a real phone:

1. `npx eas-cli@latest build --profile preview --platform android`
2. Install the .apk, sign in with the test passenger account
3. Capture: the estimate screen with a price showing, a ride in progress with
   the driver approaching, the driver's card with photo and plate, and the
   account screen
4. Repeat with the approved driver account for one driver-side shot

Use a seeded demo ride rather than a real passenger's — the screenshots are
public.

```
convert icon.png -background white -alpha remove -alpha off PNG24:icon-512-play.png
```
