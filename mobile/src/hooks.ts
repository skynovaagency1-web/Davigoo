import * as React from "react";
import { AppState } from "react-native";

// Re-run `load` every `ms` while the app is open. Simple and robust for the pilot;
// realtime subscriptions can replace it later.
export function usePolling(load: () => Promise<void> | void, ms: number, enabled = true) {
  const ref = React.useRef(load);
  ref.current = load;
  React.useEffect(() => {
    if (!enabled) return;
    let active = AppState.currentState === "active";
    const tick = () => active && ref.current();
    tick();
    const id = setInterval(tick, ms);
    const sub = AppState.addEventListener("change", (st) => {
      active = st === "active";
      if (active) ref.current();
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [ms, enabled]);
}
