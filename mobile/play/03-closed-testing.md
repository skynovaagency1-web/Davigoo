# Closed testing: 12 testers × 14 days

This is your critical path. Everything else is hours of work; this is **two weeks
of waiting that cannot be compressed**. Start it the day you pay the $25.

## The rule

New **personal** (individual) Play developer accounts must run a closed test with
**at least 12 testers who stay opted in for 14 continuous days** before you may
apply for production access.

What trips people up:

- It's 12 testers **continuously**. If someone opts out on day 9, your count
  drops below 12 and the clock can reset. Recruit **15–16** for headroom.
- Testers must **opt in via the link** and keep the app installed. Simply
  installing is not enough if they later opt out.
- The 14 days run from when the test track goes live with enough testers — not
  from when you create the app.
- Each tester opts in with the **Google account email they actually use on their
  phone's Play Store**. A different address silently fails. This is the single
  most common reason a test stalls.
- Registering as an **organisation** instead of an individual skips this
  requirement entirely, but needs a D-U-N-S number (free, ~30 days to obtain).
  If you have a registered company and are not in a hurry, that route avoids the
  whole 14-day gate.

## Setup

1. Play Console → **Test and release → Testing → Closed testing** → create a track.
2. Create a Google Group (e.g. `davigoo-testeurs@googlegroups.com`) and add testers
   there, rather than pasting emails into Play. Changing the group later doesn't
   require a new Play release.
3. Upload the `.aab` to that track.
4. Copy the **opt-in URL** and send it out.

## Recruitment message — Français

> **Objet : 2 minutes pour m'aider à lancer l'application DaviGoo**
>
> Salut,
>
> Je mets DaviGoo sur Google Play et Google demande que 12 personnes aient
> l'application installée pendant 14 jours avant la mise en ligne publique.
> C'est gratuit, sans engagement, et tu pourras la supprimer ensuite.
>
> Trois étapes :
>
> 1. Réponds-moi avec l'adresse Gmail que tu utilises sur ton téléphone Android
>    — ce doit être exactement celle-là, sinon Google refusera.
> 2. Je t'envoie un lien. Ouvre-le sur ton téléphone et appuie sur « Devenir
>    testeur ».
> 3. Installe l'application depuis le lien Play sur la même page.
>
> Ensuite, laisse-la installée pendant deux semaines. Tu n'as pas besoin de
> t'en servir, mais si tu le fais et que quelque chose cloche, dis-le-moi —
> c'est justement l'intérêt.
>
> Merci,
> David

## Where to find 15 people

You are in a better position than most apps here: the pilot already has a
**waitlist**. The `signups` table holds passengers and drivers who gave their
email and consented, filtered by `kind` and `status`. Those people asked to
hear from DaviGoo — they are the natural testers, and inviting them doubles as
the first contact before launch.

Beyond that: the drivers you have already met in person, friends and family in
Besançon, and local groups. Reddit's r/androidtesting and r/TestingAndroidApps
run tester swaps if you are still short.

iPhone users cannot help. You need 12 **Android** accounts.

## During the 14 days

Use the time rather than waiting on it:

- Add the web deletion page and put its URL in the Data safety form.
- Make the feature graphic and screenshots from the preview build.
- Settle `android.package` — it can never change once published.
- **Have testers actually request a ride.** The gate only needs them installed,
  but twelve people exercising sign-up, estimate, request and cancel against
  the real Worker is the best load the pilot will get before launch. Watch the
  `rides` table and the ops console while they do it.
- Ask each tester for one screenshot of anything that looks wrong. You will get
  device sizes and Android versions you cannot test yourself.
