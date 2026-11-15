import * as React from "react";
import { Alert, Linking, Platform, Pressable, ScrollView, Share, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth, call, errorText, type Profile, type Ride } from "../api";
import { API_URL } from "../config";
import { euro } from "../places";
import { Body, Button, C, Card, ErrorText, Label, SERIF, Title, glassText } from "../ui";
import { RUDDER_SPACE } from "./Rudder";
import { LineIcon, TileGrid, type Tile } from "./AccountTiles";

// Account page laid out like the davinova.com client account: a dark status card with a progress bar,
// a glass panel of figures, a dashed note, then a grid of glass tiles. Passenger and driver get their own content.

const LEVELS = [
  { name: "Starter", from: 0 },
  { name: "Silver", from: 5 },
  { name: "Gold", from: 15 },
  { name: "Platine", from: 40 },
];
const DRIVER_DAY_GOAL = 8;

const soon = (label: string) => () => {
  const msg = `${label} arrive avec une prochaine version de l'application pilote.`;
  if (Platform.OS === "web") window.alert(msg);
  else Alert.alert("Bientôt", msg);
};
const open = (path: string) => () => Linking.openURL(`${API_URL}${path}`);

export function Account({ profile, extra }: { profile: Profile; extra?: React.ReactNode }) {
  const isDriver = profile.role === "driver";
  const [email, setEmail] = React.useState("");
  const [rides, setRides] = React.useState<Ride[] | null>(null);
  const [view, setView] = React.useState<"home" | "history">("home");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    call<{ user: { email: string } }>("/auth/me").then(({ data }) => setEmail(data?.user.email ?? ""));
    call<{ rides: Ride[] }>("/rides/history").then(({ data }) => setRides(data?.rides ?? []));
  }, []);

  const done = (rides ?? []).filter((r) => r.status === "completed");
  const today = new Date().toDateString();
  const doneToday = done.filter((r) => new Date(r.created_at).toDateString() === today);
  const total = (list: Ride[]) => list.reduce((s, r) => s + Number(r.price_estimate || 0), 0);

  // Store requirement and GDPR: the account can be deleted from inside the app.
  const remove = async () => {
    setBusy(true);
    setError("");
    const err = await auth.deleteAccount();
    setBusy(false);
    if (err) setError(err.message === "ride_in_progress" ? "Terminez ou annulez votre course avant de supprimer le compte." : errorText(err));
  };
  const confirmRemove = () => {
    const msg = "Votre compte, vos courses et vos informations seront effacés définitivement.";
    if (Platform.OS === "web") return window.confirm(`Supprimer mon compte ? ${msg}`) && remove();
    Alert.alert("Supprimer mon compte ?", msg, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: remove },
    ]);
  };

  if (view === "history") return <History rides={rides} isDriver={isDriver} onBack={() => setView("home")} />;

  const history = () => setView("history");
  const tiles: Tile[] = isDriver
    ? [
        { icon: "coins", label: "Gains", onPress: history },
        { icon: "route", label: "Courses", onPress: history },
        { icon: "file", label: "Documents", onPress: soon("Le suivi de vos documents"), soon: true },
        { icon: "car", label: "Véhicule", onPress: soon("La modification du véhicule"), soon: true },
        { icon: "star", label: "Évaluations", onPress: soon("Les évaluations"), soon: true },
        { icon: "clock", label: "Horaires", onPress: soon("Le planning de vos disponibilités"), soon: true },
        { icon: "gift", label: "Parrainer", onPress: () => Share.share({ message: `Je conduis avec DaviGoo à Besançon. Rejoignez les chauffeurs du pilote : ${API_URL}/chauffeurs.html` }) },
        { icon: "help", label: "Aide", onPress: open("/faq.html") },
      ]
    : [
        { icon: "route", label: "Trajets", onPress: history },
        { icon: "receipt", label: "Reçus", onPress: soon("Les reçus"), soon: true },
        { icon: "pin", label: "Adresses", onPress: soon("Les adresses favorites"), soon: true },
        { icon: "card", label: "Paiement", onPress: soon("Le paiement dans l'app"), soon: true },
        { icon: "gift", label: "Parrainer", onPress: () => Share.share({ message: `Je réserve mes trajets avec DaviGoo à Besançon : ${API_URL}` }) },
        { icon: "shield", label: "Sécurité", onPress: open("/securite.html") },
        { icon: "book", label: "Guide", onPress: open("/comment-ca-marche.html") },
        { icon: "help", label: "FAQ", onPress: open("/faq.html") },
      ];

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: RUDDER_SPACE }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
        <Title>Compte</Title>
        <View style={{ alignItems: "flex-end", flexShrink: 1, paddingBottom: 6 }}>
          <Text style={{ fontFamily: SERIF, fontSize: 22, color: C.fg }}>{profile.first_name}</Text>
          {!!email && <Text numberOfLines={1} style={{ fontSize: 12, color: C.muted }}>{email}</Text>}
        </View>
      </View>

      {isDriver ? (
        <StatusCard
          title="Aujourd'hui"
          right={`${doneToday.length} / ${DRIVER_DAY_GOAL} courses`}
          progress={doneToday.length / DRIVER_DAY_GOAL}
          foot={`≈ ${euro(total(doneToday))} estimés`}
        />
      ) : (
        <LevelCard count={done.length} />
      )}

      <Card style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, padding: 14 }}>
        {(isDriver
          ? [
              { k: "Gains estimés", v: euro(total(done)), link: "Historique", onPress: history },
              { k: "Courses", v: String(done.length), link: "Voir", onPress: history },
            ]
          : [
              { k: "Trajets", v: String(done.length), link: "Historique", onPress: history },
              { k: "Dépensé (estim.)", v: euro(total(done)), link: "Détail", onPress: history },
            ]
        ).map((s) => (
          <Stat key={s.k} {...s} loading={rides === null} />
        ))}
      </Card>

      <View style={{ borderWidth: 1.5, borderStyle: "dashed", borderColor: "rgba(255,248,240,0.7)", borderRadius: 18, padding: 16, flexDirection: "row", gap: 12, alignItems: "center" }}>
        <LineIcon name="sparkle" />
        <Text style={[glassText, { flex: 1, fontSize: 15, fontWeight: "600", lineHeight: 21 }]}>
          {isDriver
            ? "Pilote à Besançon : la commission et les règles seront définies avec les premiers chauffeurs."
            : "Pilote à Besançon : les prix affichés sont des estimations, le paiement arrive bientôt."}
        </Text>
      </View>

      <TileGrid tiles={tiles} />

      {extra}

      <View style={{ marginTop: 8, gap: 12 }}>
        <Button title="Se déconnecter" variant="outline" onPress={() => auth.signOut()} />
        <ErrorText>{error}</ErrorText>
        <Button title="Supprimer mon compte" variant="outline" busy={busy} onPress={confirmRemove} />
      </View>
    </ScrollView>
  );
}

function LevelCard({ count }: { count: number }) {
  const i = LEVELS.reduce((acc, l, idx) => (count >= l.from ? idx : acc), 0);
  const next = LEVELS[i + 1];
  const progress = next ? (count - LEVELS[i].from) / (next.from - LEVELS[i].from) : 1;
  return (
    <StatusCard
      title={LEVELS[i].name}
      right={next ? `${next.from - count} trajet${next.from - count > 1 ? "s" : ""} avant ${next.name}` : "Niveau maximum"}
      progress={progress}
      foot={next ? `${count} / ${next.from} trajets` : `${count} trajets`}
    />
  );
}

/** Dark espresso card with a title, a note on the right, a thin bronze progress bar and a figure under it. */
function StatusCard({ title, right, progress, foot }: { title: string; right: string; progress: number; foot: string }) {
  const p = Math.max(0.02, Math.min(1, progress));
  return (
    <Card dark style={{ gap: 14, borderWidth: 1, borderColor: "rgba(255,245,230,0.18)" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <LineIcon name="sparkle" color="#F4EFEA" />
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#F4EFEA" }}>{title}</Text>
        <Text style={{ marginLeft: "auto", fontSize: 13, color: "#BFB2A4" }}>{right}</Text>
      </View>
      <View style={{ height: 8, borderRadius: 999, backgroundColor: "rgba(255,245,230,0.14)", overflow: "hidden" }}>
        <LinearGradient colors={["#E9D6BC", "#B08A63"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${p * 100}%`, height: "100%", borderRadius: 999 }} />
      </View>
      <Text style={{ alignSelf: "flex-end", fontSize: 13, color: "#BFB2A4" }}>{foot}</Text>
    </Card>
  );
}

function Stat({ k, v, link, onPress, loading }: { k: string; v: string; link: string; onPress: () => void; loading: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ flexGrow: 1, flexBasis: "45%", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.5)", padding: 14, gap: 6 }}>
      <Text style={[glassText, { fontSize: 13, opacity: 0.9 }]}>{k}</Text>
      <Text style={[glassText, { fontSize: 26, fontWeight: "700" }]}>{loading ? "…" : v}</Text>
      <Text style={[glassText, { fontSize: 13, textDecorationLine: "underline" }]}>{link}</Text>
    </Pressable>
  );
}

function History({ rides, isDriver, onBack }: { rides: Ride[] | null; isDriver: boolean; onBack: () => void }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: RUDDER_SPACE }}>
      <Pressable accessibilityRole="button" onPress={onBack} hitSlop={8}>
        <Text style={{ color: C.fg, fontSize: 15 }}>‹ Compte</Text>
      </Pressable>
      <Title>{isDriver ? "Mes courses" : "Mes trajets"}</Title>
      {rides === null ? (
        <Body muted>Chargement…</Body>
      ) : rides.length === 0 ? (
        <Card>
          <Body muted>{isDriver ? "Vos courses terminées apparaîtront ici." : "Vos trajets terminés apparaîtront ici."}</Body>
        </Card>
      ) : (
        rides.map((r) => (
          <Card key={r.id} style={{ gap: 4, padding: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Label>{new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</Label>
              <Text style={{ color: r.status === "completed" ? C.fg : C.warning, fontSize: 13, fontWeight: "600" }}>
                {r.status === "completed" ? `≈ ${euro(r.price_estimate)}` : "Annulée"}
              </Text>
            </View>
            <Body>{r.pickup_label}</Body>
            <Body muted>→ {r.dropoff_label}</Body>
          </Card>
        ))
      )}
    </ScrollView>
  );
}
