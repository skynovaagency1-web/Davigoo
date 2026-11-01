import * as React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from "react-native";

export const C = {
  bg: "#EDEEE7",
  card: "#F7F8F3",
  fg: "#111D19",
  muted: "#54645E",
  border: "#C8CABF",
  primary: "#1C5947",
  primaryFg: "#F6F7F1",
  signal: "#C78B23",
  board: "#0E1512",
  boardFg: "#EAEADC",
  warning: "#B4560F",
  danger: "#B42E1D",
};

export function Title({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[s.title, style]}>{children}</Text>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}

export function Body({ children, muted, style }: { children: React.ReactNode; muted?: boolean; style?: object }) {
  return <Text style={[s.body, muted && { color: C.muted }, style]}>{children}</Text>;
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Label>{label}</Label>
      <TextInput placeholderTextColor="#8A958F" style={s.input} {...props} />
    </View>
  );
}

export function Button({
  title,
  onPress,
  busy,
  disabled,
  variant = "primary",
  style,
}: {
  title: string;
  onPress: () => void;
  busy?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "danger" | "signal";
  style?: ViewStyle;
}) {
  const bg = { primary: C.primary, outline: "transparent", danger: C.danger, signal: C.signal }[variant];
  const fg = variant === "outline" ? C.fg : C.primaryFg;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || busy}
      style={({ pressed }) => [
        s.button,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        variant === "outline" && { borderWidth: 1, borderColor: C.fg },
        style,
      ]}
    >
      {busy ? <ActivityIndicator color={fg} /> : <Text style={[s.buttonText, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[s.chip, active ? { backgroundColor: C.fg, borderColor: C.fg } : null]}
    >
      <Text style={{ color: active ? C.bg : C.fg, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, dark, style }: { children: React.ReactNode; dark?: boolean; style?: ViewStyle }) {
  return <View style={[s.card, dark && { backgroundColor: C.board, borderColor: C.board }, style]}>{children}</View>;
}

export function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return <Text style={{ color: C.warning, fontWeight: "600" }}>{children}</Text>;
}

export const s = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "900", color: C.fg, letterSpacing: -0.5 },
  label: { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.muted, fontWeight: "600" },
  body: { fontSize: 16, color: C.fg, lineHeight: 22 },
  input: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: C.fg,
  },
  button: { minHeight: 52, borderRadius: 6, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  buttonText: { fontSize: 16, fontWeight: "700" },
  chip: { borderWidth: 1, borderColor: "#9AA39C", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 16, gap: 10 },
});
