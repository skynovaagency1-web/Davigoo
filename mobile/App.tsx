// MOVA mobile starter: rider and driver demo screens. Everything is simulated locally,
// with no backend, GPS, dispatch, SMS or payment.
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const C = { bg: "#0b1220", card: "#131c2e", line: "#2a3654", text: "#e9edf5", muted: "#9aa6bf", accent: "#f5b700", ok: "#2ecc8f" };

const PLACES = ["Gare Viotte", "Centre-ville", "Campus Bouloie", "CHU Minjoz", "Gare TGV"];
const CATEGORIES = [
  { id: "standard", label: "Standard", price: 9.5 },
  { id: "confort", label: "Confort", price: 12.5 },
  { id: "van", label: "Van", price: 15 },
];

export default function App() {
  const [mode, setMode] = useState<"rider" | "driver">("rider");
  return (
    <SafeAreaView style={s.root}>
      <StatusBar style="light" />
      <View style={s.banner}>
        <Text style={s.bannerText}>Prototype : aucune course ni paiement réels</Text>
      </View>
      <View style={s.toggle}>
        {(["rider", "driver"] as const).map((m) => (
          <Pressable key={m} onPress={() => setMode(m)} style={[s.toggleBtn, mode === m && s.toggleOn]}>
            <Text style={[s.toggleText, mode === m && { color: "#1a1400" }]}>{m === "rider" ? "Passager" : "Chauffeur"}</Text>
          </Pressable>
        ))}
      </View>
      {mode === "rider" ? <Rider key="r" /> : <Driver key="d" />}
    </SafeAreaView>
  );
}

function Rider() {
  const [to, setTo] = useState(PLACES[2]);
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [step, setStep] = useState<"plan" | "searching" | "matched" | "ontrip" | "done">("plan");

  useEffect(() => {
    if (step === "searching") {
      const t = setTimeout(() => setStep("matched"), 2000);
      return () => clearTimeout(t);
    }
    if (step === "ontrip") {
      const t = setTimeout(() => setStep("done"), 4000);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <View style={s.screen}>
      <View style={s.map}><Text style={s.muted}>Carte (fictive)</Text></View>
      <View style={s.sheet}>
        {step === "plan" && (
          <>
            <Text style={s.h2}>Depuis Gare Viotte, vers…</Text>
            <View style={s.chips}>
              {PLACES.slice(1).map((p) => (
                <Chip key={p} label={p} on={to === p} onPress={() => setTo(p)} />
              ))}
            </View>
            {CATEGORIES.map((c) => (
              <Pressable key={c.id} onPress={() => setCat(c)} style={[s.row, cat.id === c.id && s.rowOn]}>
                <Text style={s.text}>{c.label}</Text>
                <Text style={s.bold}>{c.price.toFixed(2).replace(".", ",")} €</Text>
              </Pressable>
            ))}
            <Btn label="Commander (démo)" onPress={() => setStep("searching")} />
          </>
        )}
        {step === "searching" && <Text style={s.h2}>Recherche d'un chauffeur…</Text>}
        {step === "matched" && (
          <>
            <Text style={s.h2}>Karim B. arrive (fictif)</Text>
            <Text style={s.muted}>Peugeot 508 · AB-123-CD</Text>
            <Btn label="Je suis à bord" onPress={() => setStep("ontrip")} />
          </>
        )}
        {step === "ontrip" && <Text style={s.h2}>En route vers {to}…</Text>}
        {step === "done" && (
          <>
            <Text style={s.h2}>Course terminée</Text>
            <Text style={s.muted}>Total fictif : {cat.price.toFixed(2).replace(".", ",")} €</Text>
            <Btn label="Nouvelle course" onPress={() => setStep("plan")} />
          </>
        )}
      </View>
    </View>
  );
}

function Driver() {
  const [step, setStep] = useState<"offline" | "waiting" | "request" | "pickup" | "ontrip">("offline");
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    if (step !== "waiting") return;
    const t = setTimeout(() => setStep("request"), 2500);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <View style={s.screen}>
      <View style={s.map}>
        <Text style={s.muted}>Gains du jour (fictifs) : {earned.toFixed(2).replace(".", ",")} €</Text>
      </View>
      <View style={s.sheet}>
        {step === "offline" && <Btn label="Passer en ligne" onPress={() => setStep("waiting")} />}
        {step === "waiting" && (
          <>
            <Text style={[s.h2, { color: C.ok }]}>En ligne · en attente…</Text>
            <Btn label="Passer hors ligne" ghost onPress={() => setStep("offline")} />
          </>
        )}
        {step === "request" && (
          <>
            <Text style={s.h2}>Nouvelle demande</Text>
            <Text style={s.muted}>Centre-ville → Gare TGV · 28 € (fictif)</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}><Btn label="Refuser" ghost onPress={() => setStep("waiting")} /></View>
              <View style={{ flex: 1 }}><Btn label="Accepter" onPress={() => setStep("pickup")} /></View>
            </View>
          </>
        )}
        {step === "pickup" && (
          <>
            <Text style={s.h2}>Vers Centre-ville</Text>
            <Btn label="Démarrer la course" onPress={() => setStep("ontrip")} />
          </>
        )}
        {step === "ontrip" && (
          <>
            <Text style={s.h2}>Course en cours</Text>
            <Btn
              label="Terminer la course"
              onPress={() => {
                setEarned((e) => e + 28);
                setStep("waiting");
              }}
            />
          </>
        )}
      </View>
    </View>
  );
}

function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, on && s.rowOn]}>
      <Text style={s.text}>{label}</Text>
    </Pressable>
  );
}

function Btn({ label, onPress, ghost }: { label: string; onPress: () => void; ghost?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[s.btn, ghost && s.btnGhost]}>
      <Text style={[s.btnText, ghost && { color: C.text }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  banner: { backgroundColor: C.accent, padding: 6 },
  bannerText: { color: "#1a1400", fontWeight: "700", textAlign: "center", fontSize: 12 },
  toggle: { flexDirection: "row", margin: 16, padding: 4, borderRadius: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: "center" },
  toggleOn: { backgroundColor: C.accent },
  toggleText: { color: C.muted, fontWeight: "700" },
  screen: { flex: 1 },
  map: { flex: 1, margin: 16, marginTop: 0, borderRadius: 16, backgroundColor: C.card, alignItems: "center", justifyContent: "center" },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 10, borderTopWidth: 1, borderColor: C.line },
  h2: { color: C.text, fontSize: 18, fontWeight: "800" },
  text: { color: C.text },
  bold: { color: C.text, fontWeight: "800" },
  muted: { color: C.muted },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: C.line },
  row: { flexDirection: "row", justifyContent: "space-between", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: C.line },
  rowOn: { borderColor: C.accent, backgroundColor: "rgba(245,183,0,0.1)" },
  btn: { backgroundColor: C.accent, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  btnGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: C.line },
  btnText: { color: "#1a1400", fontWeight: "800", fontSize: 16 },
});
