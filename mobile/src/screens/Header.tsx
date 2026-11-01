import { Pressable, Text, View } from "react-native";
import { supabase } from "../supabase";
import { C } from "../ui";

export function Header({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border }}>
      <View>
        <Text style={{ fontSize: 22, fontWeight: "900", color: C.fg }}>
          MOVA <Text style={{ color: C.primary }}>{subtitle}</Text>
        </Text>
        <Text style={{ color: C.muted }}>Bonjour {name}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => supabase.auth.signOut()} hitSlop={10}>
        <Text style={{ color: C.muted, textDecorationLine: "underline" }}>Déconnexion</Text>
      </Pressable>
    </View>
  );
}
