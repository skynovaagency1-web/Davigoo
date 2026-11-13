// DaviGoo logotype, drawn in the Davinova line style: single 3.6-unit strokes on a 40-unit cap height.
// viewBox "-3 9 288 46". Lines are solid ink; the two O are wheels (tyre, five spokes, hub) in the bronze gradient.
export const LOGO_VIEWBOX = "-3 9 288 46";
export const LOGO_RATIO = 288 / 46;
export const LOGO_LINES = [
  "M0 12 V52 H8 C22 52 28 44 28 32 C28 20 22 12 8 12 Z",
  "M41 52 L55 12 L69 52",
  "M82 12 L96 52 L110 12",
  "M123 12 V52",
  "M171.32 19.14 A20 20 0 1 0 176 32 H158",
];
export const LOGO_ORBITS = ["M189 32 A20 20 0 1 1 229 32 A20 20 0 1 1 189 32", "M242 32 A20 20 0 1 1 282 32 A20 20 0 1 1 242 32"];
export const BRONZE_DARK = ["#3c2a21", "#8e735b", "#cdb69e", "#f2e6d8"];
export const BRONZE_LIGHT = ["#f2e6d8", "#cdb69e", "#8e735b", "#f2e6d8"];
export const LOGO_WHEELS = ["M209.00 26.80 L209.00 16.80 M213.95 30.39 L223.46 27.30 M212.06 36.21 L217.93 44.30 M205.94 36.21 L200.07 44.30 M204.05 30.39 L194.54 27.30 M205.8 32 A3.2 3.2 0 1 1 212.2 32 A3.2 3.2 0 1 1 205.8 32", "M262.00 26.80 L262.00 16.80 M266.95 30.39 L276.46 27.30 M265.06 36.21 L270.93 44.30 M258.94 36.21 L253.07 44.30 M257.05 30.39 L247.54 27.30 M258.8 32 A3.2 3.2 0 1 1 265.2 32 A3.2 3.2 0 1 1 258.8 32"];
export const LOGO_WHEEL_CENTERS = [[209, 32], [262, 32]] as const;
