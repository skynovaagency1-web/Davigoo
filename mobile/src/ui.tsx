import * as React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from "react-native-svg";
import { BRONZE_DARK, BRONZE_LIGHT, LOGO_LINES, LOGO_ORBITS, LOGO_RATIO, LOGO_VIEWBOX, LOGO_WHEELS } from "./logo";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from "react-native";

// Liquid-glass palette (same as davigoo.com): warm taupe wall, frosted white glass, ink-brown text, serif wordmark.
export const C = {
  bg: "#B6AA9E",
  bgTop: "#CFC5BA",
  bgBottom: "#A5988B",
  card: "rgba(255,255,255,0.22)",
  fg: "#2C251D",
  muted: "#4F443A",
  border: "rgba(44,37,29,0.1)",
  primary: "#2C251D",
  primaryFg: "#FBF8F5",
  signal: "#9C7E63",
  signalSoft: "#EADFD4",
  board: "#2C251D",
  boardFg: "#F4EFEA",
  warning: "#B4541E",
  danger: "#A53E2C",
  accentOnDark: "#D9C3A8",
};

export const SERIF = Platform.select({ ios: "Didot", android: "serif", default: "'Cormorant Garamond', Didot, Georgia, serif" });

// Glass slabs cast a soft shadow down and to the right, like the website.
export const shadow = {
  shadowColor: "#403024",
  shadowOpacity: 0.32,
  shadowRadius: 18,
  shadowOffset: { width: 10, height: 14 },
  elevation: 4,
} as const;
// White text on glass, with a faint shadow so it reads on the taupe.
export const glassText = { color: "#FFFFFF", textShadowColor: "rgba(60,45,34,0.45)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 } as const;

// Soft studio-light background used behind every screen.
export function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient colors={[C.bgTop, C.bg, C.bgBottom]} locations={[0, 0.45, 1]} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
}

// DaviGoo logotype (Davinova line style). `size` is the cap height in points; `light` uses the pale bronze for dark photos.
export function Wordmark({ size = 28, color = C.fg, light = false }: { size?: number; color?: string; light?: boolean }) {
  const id = React.useId().replace(/:/g, "");
  const h = size * 0.82, w = h * LOGO_RATIO;
  const stops = light ? BRONZE_LIGHT : BRONZE_DARK;
  return (
    <Svg width={w} height={h} viewBox={LOGO_VIEWBOX} accessibilityLabel="DaviGoo" accessibilityRole="image">
      <Defs>
        <SvgGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          {stops.map((c, i) => <Stop key={i} offset={[0, 0.4, 0.75, 1][i]} stopColor={c} />)}
        </SvgGradient>
      </Defs>
      {LOGO_LINES.map((d) => <Path key={d} d={d} fill="none" stroke={color} strokeWidth={3.6} />)}
      {LOGO_ORBITS.map((d) => <Path key={d} d={d} fill="none" stroke={`url(#${id}g)`} strokeWidth={3.6} strokeLinecap="round" />)}
      {LOGO_WHEELS.map((d) => <Path key={d} d={d} fill="none" stroke={`url(#${id}g)`} strokeWidth={2} strokeLinecap="round" />)}
    </Svg>
  );
}

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
      <TextInput placeholderTextColor="#9C8E80" style={s.input} {...props} />
    </View>
  );
}

// Liquid-glass tints, after the website reference: frosted white slab, white rim, top highlight, shadow down-right.
export const GLASS = {
  sand: { fill: "rgba(255,255,255,0.32)", glow: "#403024" },
  sage: { fill: "rgba(206,216,190,0.42)", glow: "#403024" },
  clay: { fill: "rgba(226,170,150,0.5)", glow: "#403024" },
  clear: { fill: "rgba(255,255,255,0.2)", glow: "#403024" },
} as const;
export type Tint = keyof typeof GLASS;

export function Glass({ tint = "clear", radius = 12, style, children }: { tint?: Tint; radius?: number; style?: ViewStyle; children?: React.ReactNode }) {
  const t = GLASS[tint];
  return (
    <View
      style={[
        { borderRadius: radius, backgroundColor: t.fill, borderWidth: 1, borderColor: "rgba(255,255,255,0.6)" },
        { shadowColor: t.glow, shadowOpacity: 0.3, shadowRadius: 14, shadowOffset: { width: 8, height: 12 }, elevation: 4 },
        style,
      ]}
    >
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: "hidden" }]}>
        <LinearGradient colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0)"]} locations={[0, 0.55]} style={{ position: "absolute", left: 6, right: 6, top: 2, height: "55%", borderRadius: radius }} />
        <LinearGradient colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.35)"]} style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "35%" }} />
      </View>
      {children}
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
  const tint: Tint = { primary: "sand", outline: "clear", danger: "clay", signal: "sage" }[variant] as Tint;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled || busy} style={style}>
      {({ pressed }) => (
        <View style={{ opacity: disabled ? 0.5 : 1, transform: [{ translateY: pressed ? 1 : 0 }] }}>
          {/* White glow line under the slab, like the website buttons. */}
          <View pointerEvents="none" style={s.glow} />
          <Glass tint={tint} style={s.button}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={[s.buttonText, glassText]}>{title}</Text>}
          </Glass>
        </View>
      )}
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress}>
      <Glass tint={active ? "sand" : "clear"} style={s.chip}>
        <Text style={active ? [glassText, { fontWeight: "600" }] : { color: C.fg }}>{label}</Text>
      </Glass>
    </Pressable>
  );
}

export function Card({ children, dark, style }: { children: React.ReactNode; dark?: boolean; style?: ViewStyle }) {
  if (dark)
    return (
      <LinearGradient colors={["#3B3229", "#2C251D"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.card, { shadowOpacity: 0.25 }, style]}>
        {children}
      </LinearGradient>
    );
  return <View style={[s.card, style]}>{children}</View>;
}

export function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return <Text style={{ color: C.warning, fontWeight: "500" }}>{children}</Text>;
}

export const s = StyleSheet.create({
  title: { fontFamily: SERIF, fontSize: 36, fontWeight: "400", color: C.fg, letterSpacing: -0.5 },
  label: { fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", color: C.muted, fontWeight: "600" },
  body: { fontSize: 16, color: C.fg, lineHeight: 23 },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 17,
    color: C.fg,
  },
  glow: { position: "absolute", left: "16%", right: "16%", bottom: -4, height: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.75)", shadowColor: "#fff", shadowOpacity: 0.9, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
  button: { minHeight: 56, borderRadius: 12, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  buttonText: { fontSize: 17, fontWeight: "600", letterSpacing: -0.2, color: C.fg },
  chip: { paddingHorizontal: 16, paddingVertical: 10 },
  card: { backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.55)", padding: 20, gap: 12, ...shadow },
});
