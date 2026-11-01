import { Text, View } from "react-native";
import { C, Wordmark } from "../ui";

export function Header({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
      <Wordmark size={20} />
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ color: C.fg, fontSize: 14 }}>Bonjour {name}</Text>
        <Text style={{ fontSize: 10, letterSpacing: 1.4, color: C.signal, textTransform: "uppercase" }}>{subtitle}</Text>
      </View>
    </View>
  );
}
