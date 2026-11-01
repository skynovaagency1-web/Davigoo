import * as React from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import * as Location from "expo-location";
import { reverseGeocode, searchAddress } from "../geo";
import type { Place } from "../places";
import { C, Glass } from "../ui";

// Address input with live suggestions from the national address base, and an optional "Ma position" shortcut.
export function AddressField({
  label,
  marker,
  value,
  onChange,
  onFocus,
  near,
  withLocation,
}: {
  label: string;
  marker: "dot" | "square";
  value: Place | null;
  onChange: (p: Place | null) => void;
  onFocus?: () => void;
  near?: { lat: number; lng: number };
  withLocation?: boolean;
}) {
  const [text, setText] = React.useState(value?.label ?? "");
  const [results, setResults] = React.useState<Place[]>([]);
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    setText(value?.label ?? "");
  }, [value?.id]);

  React.useEffect(() => {
    if (!open || text === value?.label) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setBusy(true);
      searchAddress(text, near, ctrl.signal)
        .then((r) => {
          setResults(r);
          setNote(r.length || text.trim().length < 3 ? "" : "Aucune adresse trouvée.");
        })
        .catch((e) => e?.name !== "AbortError" && setNote("Recherche indisponible. Vérifiez la connexion."))
        .finally(() => setBusy(false));
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [text, open]);

  const pick = (p: Place) => {
    onChange(p);
    setText(p.label);
    setResults([]);
    setOpen(false);
    setNote("");
  };

  const locate = async () => {
    setNote("");
    setBusy(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return setNote("Autorisez la localisation pour utiliser votre position.");
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude: lat, longitude: lng } = pos.coords;
      const place = (await reverseGeocode(lat, lng)) ?? { id: `${lat},${lng}`, label: "Ma position", short: "Ma position", lat, lng };
      pick({ ...place, label: place.label, short: "Ma position" });
    } catch {
      setNote("Position introuvable. Saisissez l'adresse.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ gap: 6, zIndex: open ? 10 : 1 }}>
      <Glass style={{ flexDirection: "row", alignItems: "center", gap: 12, height: 56, paddingLeft: 18, paddingRight: 8 }}>
        <View style={marker === "dot" ? { width: 10, height: 10, borderRadius: 5, backgroundColor: C.signal } : { width: 10, height: 10, backgroundColor: C.fg }} />
        <TextInput
          accessibilityLabel={label}
          placeholder={label}
          placeholderTextColor="#9C8E80"
          value={text}
          onChangeText={(t) => {
            setText(t);
            setOpen(true);
            if (value) onChange(null);
          }}
          onFocus={() => {
            setOpen(true);
            onFocus?.();
          }}
          autoCorrect={false}
          returnKeyType="search"
          style={{ flex: 1, minWidth: 0, fontSize: 16, color: C.fg, paddingVertical: 0 }}
        />
        {busy ? (
          <ActivityIndicator color={C.muted} style={{ marginRight: 8 }} />
        ) : withLocation && !value ? (
          <Pressable accessibilityRole="button" onPress={locate} hitSlop={6} style={{ paddingHorizontal: 12, height: 38, borderRadius: 999, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 12, color: C.fg }}>◎ Ma position</Text>
          </Pressable>
        ) : !!text ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Effacer" onPress={() => { setText(""); onChange(null); setResults([]); }} hitSlop={10} style={{ paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 18, color: C.muted }}>×</Text>
          </Pressable>
        ) : null}
      </Glass>
      {!!note && <Text style={{ color: C.muted, fontSize: 13, paddingHorizontal: 18 }}>{note}</Text>}
      {open && results.length > 0 && (
        <Glass radius={22} style={{ paddingVertical: 6, backgroundColor: "rgba(251,248,245,0.96)" }}>
          {results.map((r, i) => (
            <Pressable key={r.id + i} accessibilityRole="button" onPress={() => pick(r)} style={({ pressed }) => ({ paddingHorizontal: 18, paddingVertical: 11, backgroundColor: pressed ? "rgba(216,193,168,0.35)" : "transparent" })}>
              <Text style={{ color: C.fg, fontSize: 15 }} numberOfLines={1}>{r.short}</Text>
              <Text style={{ color: C.muted, fontSize: 12 }} numberOfLines={1}>{r.label}</Text>
            </Pressable>
          ))}
        </Glass>
      )}
    </View>
  );
}
