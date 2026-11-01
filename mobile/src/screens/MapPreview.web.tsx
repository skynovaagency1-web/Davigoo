import { Text, View } from "react-native";
import { C } from "../ui";

type Pt = { lat: number; lng: number } | null | undefined;

// Web preview build only (react-native-maps has no web version); phones get the real map.
export function MapPreview({ height = 190 }: { from?: Pt; to?: Pt; car?: (Pt & { heading?: number | null }) | null; height?: number }) {
  return (
    <View style={{ height, borderRadius: 26, backgroundColor: "#E4D9CD", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.9)" }}>
      <Text style={{ color: C.muted, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" }}>Carte</Text>
    </View>
  );
}
