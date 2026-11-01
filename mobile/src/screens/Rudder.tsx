import * as React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C, Glass, type Tint } from "../ui";

// "Rudder" menu: a floating glass bar with one side tab on each side and a raised centre action.
export type IconName = "route" | "person" | "plus" | "power" | "list";
type Side = { icon: IconName; label: string; active: boolean; onPress: () => void };

export const RUDDER_SPACE = 120;

export function Rudder({ left, right, center }: { left: Side; right: Side; center: { icon: IconName; label: string; onPress: () => void; busy?: boolean; disabled?: boolean; tint?: Tint } }) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: Math.max(insets.bottom, 12) + 4, alignItems: "center" }}>
      <Glass style={{ flexDirection: "row", alignItems: "center", gap: 26, paddingHorizontal: 14, height: 68, backgroundColor: "rgba(251,248,245,0.78)" }}>
        <Tab {...left} />
        <Pressable accessibilityRole="button" accessibilityLabel={center.label} onPress={center.onPress} disabled={center.disabled || center.busy} style={{ marginTop: -30 }}>
          {({ pressed }) => (
            <Glass tint={center.tint ?? "sand"} style={{ width: 72, height: 72, alignItems: "center", justifyContent: "center", opacity: center.disabled ? 0.5 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }}>
              {center.busy ? <ActivityIndicator color={C.fg} /> : <Icon name={center.icon} size={26} />}
            </Glass>
          )}
        </Pressable>
        <Tab {...right} />
      </Glass>
    </View>
  );
}

function Tab({ icon, label, active, onPress }: Side) {
  return (
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={label} onPress={onPress} hitSlop={8} style={{ alignItems: "center", width: 64, gap: 4 }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: active ? C.fg : "transparent" }}>
        <Icon name={icon} size={18} color={active ? C.primaryFg : C.muted} />
      </View>
      <Text style={{ fontSize: 10, letterSpacing: 0.6, color: active ? C.fg : C.muted }}>{label}</Text>
    </Pressable>
  );
}

// Small line icons drawn with views, so the app needs no icon font.
export function Icon({ name, size = 20, color = C.fg }: { name: IconName; size?: number; color?: string }) {
  const w = Math.max(1.5, size / 11);
  if (name === "plus" || name === "power")
    return name === "plus" ? (
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <View style={{ position: "absolute", width: size, height: w, borderRadius: w, backgroundColor: color }} />
        <View style={{ position: "absolute", width: w, height: size, borderRadius: w, backgroundColor: color }} />
      </View>
    ) : (
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: size * 0.82, height: size * 0.82, borderRadius: size, borderWidth: w, borderColor: color, borderTopColor: "transparent", marginTop: size * 0.12 }} />
        <View style={{ position: "absolute", top: 0, width: w, height: size * 0.5, borderRadius: w, backgroundColor: color }} />
      </View>
    );
  if (name === "person")
    return (
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ width: size * 0.42, height: size * 0.42, borderRadius: size, borderWidth: w, borderColor: color }} />
        <View style={{ width: size * 0.8, height: size * 0.42, borderTopLeftRadius: size, borderTopRightRadius: size, borderWidth: w, borderBottomWidth: 0, borderColor: color }} />
      </View>
    );
  if (name === "list")
    return (
      <View style={{ width: size, height: size, justifyContent: "space-evenly" }}>
        {[1, 0.7, 0.85].map((f, i) => <View key={i} style={{ width: size * f, height: w, borderRadius: w, backgroundColor: color }} />)}
      </View>
    );
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "space-between" }}>
      <View style={{ width: size * 0.32, height: size * 0.32, borderRadius: size, borderWidth: w, borderColor: color }} />
      <View style={{ width: w, flex: 1, marginVertical: 1, backgroundColor: color, opacity: 0.6 }} />
      <View style={{ width: size * 0.32, height: size * 0.32, borderRadius: size, backgroundColor: color }} />
    </View>
  );
}
