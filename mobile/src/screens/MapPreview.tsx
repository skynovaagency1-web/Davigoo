import * as React from "react";
import { View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { DEFAULT_REGION } from "../geo";
import { C } from "../ui";

type Pt = { lat: number; lng: number } | null | undefined;

// Small map with the pick-up (taupe dot) and drop-off (ink square). Apple Maps on iOS, Google Maps on Android.
export function MapPreview({ from, to, car, height = 190 }: { from?: Pt; to?: Pt; car?: (Pt & { heading?: number | null }) | null; height?: number }) {
  const ref = React.useRef<MapView>(null);
  const pts = [from, to, car].filter(Boolean) as { lat: number; lng: number }[];

  React.useEffect(() => {
    if (!ref.current) return;
    if (pts.length >= 2)
      ref.current.fitToCoordinates(pts.map((p) => ({ latitude: p.lat, longitude: p.lng })), { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true });
    else if (pts.length === 1) ref.current.animateToRegion({ latitude: pts[0].lat, longitude: pts[0].lng, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 400);
  }, [from?.lat, from?.lng, to?.lat, to?.lng, !!car]);

  return (
    <View style={{ height, borderRadius: 26, overflow: "hidden", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.9)", backgroundColor: "#E4D9CD" }}>
      <MapView ref={ref} style={{ flex: 1 }} initialRegion={DEFAULT_REGION} mapType="mutedStandard" showsPointsOfInterests={false} toolbarEnabled={false} pitchEnabled={false} rotateEnabled={false}>
        {from && (
          <Marker coordinate={{ latitude: from.lat, longitude: from.lng }} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: C.signal, borderWidth: 3, borderColor: "#fff" }} />
          </Marker>
        )}
        {to && (
          <Marker coordinate={{ latitude: to.lat, longitude: to.lng }} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <View style={{ width: 16, height: 16, backgroundColor: C.fg, borderWidth: 3, borderColor: "#fff" }} />
          </Marker>
        )}
        {car && (
          <Marker coordinate={{ latitude: car.lat, longitude: car.lng }} anchor={{ x: 0.5, y: 0.5 }} flat rotation={car.heading ?? 0} tracksViewChanges={false}>
            <CarDot />
          </Marker>
        )}
        {from && to && (
          <Polyline coordinates={[{ latitude: from.lat, longitude: from.lng }, { latitude: to.lat, longitude: to.lng }]} strokeColor={C.fg} strokeWidth={2} lineDashPattern={[6, 6]} />
        )}
      </MapView>
    </View>
  );
}

// The driver: ink disc with a white rim and a small arrow showing the direction of travel.
function CarDot() {
  return (
    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.fg, borderWidth: 3, borderColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }}>
      <View style={{ width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderBottomWidth: 11, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#fff", marginTop: -2 }} />
    </View>
  );
}
