import * as React from "react";
import type { Session } from "@supabase/supabase-js";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { supabase, type Profile } from "./src/supabase";
import { C } from "./src/ui";
import { Login } from "./src/screens/Login";
import { Onboarding } from "./src/screens/Onboarding";
import { Passenger } from "./src/screens/Passenger";
import { Driver } from "./src/screens/Driver";

// One codebase for both apps: the account's role decides which one you see.
// The two store apps (passenger / driver) will be built from this code later.
export default function App() {
  const [session, setSession] = React.useState<Session | null | undefined>(undefined);
  const [profile, setProfile] = React.useState<Profile | null | undefined>(undefined);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const loadProfile = React.useCallback(async () => {
    if (!session) return setProfile(undefined);
    const { data } = await supabase.from("mova_profiles").select("*").eq("user_id", session.user.id).maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }, [session?.user.id]);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  let screen: React.ReactNode;
  if (session === undefined || (session && profile === undefined)) screen = <ActivityIndicator style={{ marginTop: 80 }} color={C.primary} />;
  else if (!session) screen = <Login />;
  else if (!profile) screen = <Onboarding onDone={loadProfile} />;
  else screen = profile.role === "driver" ? <Driver profile={profile} /> : <Passenger profile={profile} />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar style="dark" />
        <View style={{ flex: 1 }}>{screen}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
