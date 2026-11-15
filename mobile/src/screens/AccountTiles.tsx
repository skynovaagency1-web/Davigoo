import * as React from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Glass, glassText } from "../ui";

// Line icons (24px grid, Lucide-style paths) drawn with react-native-svg, so no icon font is needed.
const PATHS = {
  route: ["M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M18 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M9 16h5.5a3.5 3.5 0 0 0 0-7H12"],
  receipt: ["M4 2v20l3-2 3 2 3-2 3 2 3-2 1 1V2l-1 1-3-2-3 2-3-2-3 2-3-2z", "M8 8h8", "M8 12h8", "M8 16h5"],
  pin: ["M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  card: ["M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z", "M2 10h20"],
  gift: ["M3 8h18v4H3z", "M12 8v13", "M19 12v9H5v-9", "M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"],
  shield: ["M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z", "M9 12l2 2 4-4"],
  help: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3", "M12 17h.01"],
  book: ["M4 19.5V5a2 2 0 0 1 2-2h14v18H6.5a2.5 2.5 0 0 1 0-5H20"],
  coins: ["M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12z", "M18.1 10.4A6 6 0 1 1 10.3 18", "M7 6h1v4", "M16.7 13.9l.7.7-2.8 2.8"],
  file: ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z", "M14 2v5h5", "M9 15l2 2 4-4"],
  car: ["M19 17h2v-4l-2.5-5.5A2 2 0 0 0 16.7 6H7.3a2 2 0 0 0-1.8 1.5L3 13v4h2", "M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", "M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", "M9 17h6", "M3 13h18"],
  star: ["M11.5 2.3a.5.5 0 0 1 1 0l2.3 4.7a2 2 0 0 0 1.5 1.1l5.2.8a.5.5 0 0 1 .3.9l-3.8 3.7a2 2 0 0 0-.6 1.8l.9 5.2a.5.5 0 0 1-.8.6l-4.6-2.5a2 2 0 0 0-1.9 0l-4.6 2.5a.5.5 0 0 1-.8-.6l.9-5.2a2 2 0 0 0-.6-1.8L1.7 9.8a.5.5 0 0 1 .3-.9l5.2-.8a2 2 0 0 0 1.5-1.1z"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  sparkle: ["M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z"],
} as const;
export type TileIcon = keyof typeof PATHS;

export function LineIcon({ name, size = 22, color = "#fff" }: { name: TileIcon; size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name].map((d) => <Path key={d} d={d} />)}
    </Svg>
  );
}

export type Tile = { icon: TileIcon; label: string; onPress: () => void; soon?: boolean };

/** Grid of glass tiles, four per row (davinova.com account style): icon in a small glass square, label under it. */
export function TileGrid({ tiles }: { tiles: Tile[] }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
      {tiles.map((t) => (
        <Pressable
          key={t.label}
          accessibilityRole="button"
          accessibilityLabel={t.soon ? `${t.label}, bientôt` : t.label}
          onPress={t.onPress}
          style={({ pressed }) => ({ width: "21%", flexGrow: 1, transform: [{ scale: pressed ? 0.96 : 1 }] })}
        >
          <Glass radius={18} style={{ alignItems: "center", gap: 8, paddingVertical: 14, paddingHorizontal: 4, opacity: t.soon ? 0.72 : 1 }}>
            <Glass tint="sand" radius={12} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
              <LineIcon name={t.icon} />
            </Glass>
            <Text numberOfLines={1} style={[glassText, { fontSize: 12, fontWeight: "500" }]}>{t.label}</Text>
          </Glass>
        </Pressable>
      ))}
    </View>
  );
}
