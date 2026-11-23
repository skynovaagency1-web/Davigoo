# Google Play pack — DaviGoo

The app is **Expo / React Native**, built and signed in the cloud by EAS. It is
not a web wrapper, so none of the Trusted Web Activity machinery applies: no
`android/` folder, no Digital Asset Links file, no `assetlinks.json`. Build
instructions are in [`../EAS.md`](../EAS.md).

| File | What it is |
|---|---|
| `01-store-listing.md` | Title and descriptions in French, with English short description |
| `02-app-content-and-data-safety.md` | Every App content and Data safety answer, taken from the schema and the app code |
| `03-closed-testing.md` | The 12-tester / 14-day gate |

## Ready

- In-app account deletion (Compte → Supprimer mon compte)
- Location is **foreground only** — no background-location review to pass
- No payments, so no financial declarations
- `expo-doctor` 20/20, typecheck clean
- `eas.json` with development / preview / production profiles and remote
  version management

## Needed before submitting

| | |
|---|---|
| **Decide `android.package`** | currently `fr.mova.app`, and it can **never** change after publishing |
| Web deletion URL | `suppression-compte.html` — Play wants one beside the in-app route |
| Feature graphic + screenshots | need a real device; see `01-store-listing.md` |
| Test credentials | a passenger account **and an approved driver account**, or review sees the waiting screen and rejects |
| Expo account + `eas init` | links the project and writes `extra.eas.projectId` |
| Play developer account | $25, one-off |
| 12 testers × 14 days | the long pole |

## Open questions only you can answer

Both are marked **DECIDE** in `02-...md`:

- **Is the pilot actually carrying passengers?** A live ride-hailing service is
  reviewed harder than a demo, and the listing should say which it is.
- **VTC licensing.** France requires operator registration and a carte VTC per
  driver. Play sometimes asks transport apps to evidence it.
