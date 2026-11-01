import * as React from "react";
import * as Location from "expo-location";
import { supabase } from "../supabase";

export type ShareState = "starting" | "sharing" | "denied" | "error";

// While the driver has an active ride, send the phone's position every few seconds.
// Expo Go only runs this while the app is open; background tracking comes with the store build.
export function useShareLocation(rideId: number | null) {
  const [state, setState] = React.useState<ShareState>("starting");

  React.useEffect(() => {
    if (!rideId) return;
    let sub: Location.LocationSubscription | null = null;
    let last = 0;
    let stopped = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (stopped) return;
      if (status !== "granted") return setState("denied");
      sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 4000, distanceInterval: 15 }, async (pos) => {
        const now = Date.now();
        if (now - last < 3500) return;
        last = now;
        const { latitude, longitude, heading } = pos.coords;
        const { error } = await supabase.rpc("mova_update_location", {
          p_ride_id: rideId,
          p_lat: latitude,
          p_lng: longitude,
          p_heading: heading != null && heading >= 0 ? heading : null,
        });
        setState(error ? "error" : "sharing");
      });
      if (stopped) sub.remove();
    })().catch(() => setState("error"));
    return () => {
      stopped = true;
      sub?.remove();
    };
  }, [rideId]);

  return state;
}
