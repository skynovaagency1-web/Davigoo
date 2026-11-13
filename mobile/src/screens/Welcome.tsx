import * as React from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { C } from "../ui";
import { INTRO_FILM_HTML } from "../intro-film";

// Opening film: the black saloon drives in, brakes, shatters into thousands of pieces that reform as the
// DaviGoo logo, then the liquid-glass pill appears around it. About 7 s; a tap skips it.
export function Welcome({ onDone }: { onDone: () => void }) {
  const exit = React.useRef(new Animated.Value(1)).current;
  const finished = React.useRef(false);

  const finish = React.useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    Animated.timing(exit, { toValue: 0, duration: 450, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(() => onDone());
  }, [onDone]);

  // Safety net in case the film never reports back.
  React.useEffect(() => {
    const t = setTimeout(finish, 11000);
    return () => clearTimeout(t);
  }, [finish]);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: C.bgTop, opacity: exit }]}>
      <WebView
        source={{ html: INTRO_FILM_HTML }}
        originWhitelist={["*"]}
        style={{ flex: 1, backgroundColor: "transparent" }}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        onMessage={(e) => e.nativeEvent.data === "done" && finish()}
        onError={finish}
        javaScriptEnabled
        accessibilityLabel="DaviGoo"
      />
    </Animated.View>
  );
}
