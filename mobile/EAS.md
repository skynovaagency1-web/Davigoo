# Building and shipping the DaviGoo app

The app is Expo / React Native, so it is **not** a Trusted Web Activity like the
Skynova and Davinova sites. There is no `android/` folder to maintain and no
Digital Asset Links file to serve: EAS generates the native project and signs
the build in the cloud (Continuous Native Generation). Never create or edit
`android/` or `ios/` by hand — configure native behaviour in `app.json`.

## One-off setup

```
npm install -g eas-cli      # or run every command as: npx eas-cli@latest <cmd>
npx eas-cli@latest login
npx eas-cli@latest init     # links this folder to an Expo project
```

`eas init` writes `extra.eas.projectId` into app.json. Commit that.

## Versions

`eas.json` sets `cli.appVersionSource` to `remote`, which is the recommended
behaviour from EAS CLI 12. Expo stores `android.versionCode` server-side and
`production` has `autoIncrement: true`, so every production build gets a fresh
versionCode without anyone editing a file. The most common cause of a rejected
upload — a duplicate version number — stops being possible.

`version` in app.json ("0.1.0") stays manual: bump it when you want the
user-facing version in the store to change.

If the app is ever published outside EAS and the numbers drift, resync with
`npx eas-cli@latest build:version:set`.

## Builds

```
npx eas-cli@latest build --profile preview --platform android
```

`preview` produces an **.apk** that installs directly on a phone — use it to
test on real devices and to hand builds to the pilot drivers.

```
npx eas-cli@latest build --profile production --platform android
```

`production` produces an **.aab**, which is what Play requires.

`development` builds include `expo-dev-client`; they are only needed once the
app uses a native module Expo Go does not bundle.

## Submitting

```
npx eas-cli@latest submit --profile production --platform android
```

Submits to the **internal** track (set in `eas.json`). For a new personal Play
account the closed-testing requirement applies before production: see
`play/03-closed-testing.md`.

## Before the first build, decide the package name

`android.package` is currently **`fr.mova.app`**, from the project's earlier
name. **It can never be changed once the app is on Play** — a different package
name is a different app, with a new listing and no way to migrate installs.

`slug` is also still `mova`. That one only affects the Expo project URL and can
be changed freely before `eas init`.

Settle both before the first production build.
