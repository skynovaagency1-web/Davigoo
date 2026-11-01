import * as React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Switch, Text, View } from "react-native";
import { usePolling } from "../hooks";
import { errorText, supabase, type Contact, type Driver as DriverRow, type Profile, type Ride } from "../supabase";
import { Body, Button, C, Card, ErrorText, Label, Title } from "../ui";
import { Header } from "./Header";
import { RideRoute } from "./RideRoute";

const NEXT: Partial<Record<Ride["status"], { status: Ride["status"]; label: string; title: string }>> = {
  accepted: { status: "arriving", label: "Je pars chercher le passager", title: "Course acceptée" },
  arriving: { status: "in_progress", label: "Passager à bord", title: "En route vers le passager" },
  in_progress: { status: "completed", label: "Terminer la course", title: "Course en cours" },
};

export function Driver({ profile }: { profile: Profile }) {
  const [driver, setDriver] = React.useState<DriverRow | null | undefined>(undefined);
  const [ride, setRide] = React.useState<Ride | null>(null);
  const [requests, setRequests] = React.useState<Ride[]>([]);
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const [{ data: d }, { data: mine }] = await Promise.all([
      supabase.from("mova_drivers").select("*").eq("user_id", profile.user_id).maybeSingle(),
      supabase
        .from("mova_rides")
        .select("*")
        .eq("driver_id", profile.user_id)
        .in("status", ["accepted", "arriving", "in_progress"])
        .limit(1)
        .maybeSingle(),
    ]);
    setDriver((d as DriverRow | null) ?? null);
    setRide((mine as Ride | null) ?? null);
    if (d?.online && !mine) {
      const { data: open } = await supabase.from("mova_rides").select("*").eq("status", "requested").order("created_at").limit(20);
      setRequests((open as Ride[] | null) ?? []);
    } else setRequests([]);
  }, [profile.user_id]);

  usePolling(load, driver?.online || ride ? 4000 : 20000);

  const run = async (key: string, fn: () => PromiseLike<{ error: unknown }>) => {
    setBusy(key);
    setError("");
    const { error } = await fn();
    setBusy(null);
    if (error) setError(errorText(error));
    await load();
  };

  const header = <Header name={profile.first_name} subtitle="Chauffeur" />;
  if (driver === undefined) return <View style={{ flex: 1 }}>{header}<ActivityIndicator style={{ marginTop: 40 }} color={C.primary} /></View>;

  if (!driver) {
    return (
      <View style={{ flex: 1 }}>
        {header}
        <View style={{ padding: 20 }}><Body>Profil chauffeur introuvable. Contactez MOVA.</Body></View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {header}
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}>
        {!driver.approved ? (
          <Card>
            <Title style={{ fontSize: 22 }}>Compte en attente de validation</Title>
            <Body muted>
              MOVA vérifie votre carte VTC, votre assurance et votre véhicule ({driver.vehicle}, {driver.plate}). Vous pourrez passer en ligne dès la validation. Tirez vers le bas pour actualiser.
            </Body>
          </Card>
        ) : (
          <Card dark style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.boardFg, fontSize: 22, fontWeight: "900" }}>{driver.online ? "En ligne" : "Hors ligne"}</Text>
              <Text style={{ color: "#9AA8A1" }}>{driver.vehicle} · {driver.plate}</Text>
            </View>
            {busy === "online" ? (
              <ActivityIndicator color={C.signal} />
            ) : (
              <Switch
                accessibilityLabel="Passer en ligne"
                value={driver.online}
                onValueChange={(v) => run("online", () => supabase.rpc("mova_update_driver", { p_online: v }))}
                trackColor={{ true: C.signal, false: "#3A4641" }}
              />
            )}
          </Card>
        )}
        <ErrorText>{error}</ErrorText>
        {ride ? (
          <ActiveRide ride={ride} busy={busy} run={run} />
        ) : driver.online ? (
          <View style={{ gap: 12 }}>
            <Label>Demandes à proximité ({requests.length})</Label>
            {requests.length === 0 && <Body muted>Aucune demande pour le moment. La liste s'actualise toute seule.</Body>}
            {requests.map((r) => (
              <Card key={r.id}>
                <RideRoute ride={r} />
                <Button title="Accepter" busy={busy === `accept-${r.id}`} onPress={() => run(`accept-${r.id}`, () => supabase.rpc("mova_accept_ride", { p_ride_id: r.id }))} />
              </Card>
            ))}
          </View>
        ) : driver.approved ? (
          <Body muted>Passez en ligne pour recevoir des demandes de course.</Body>
        ) : null}
      </ScrollView>
    </View>
  );
}

function ActiveRide({ ride, busy, run }: { ride: Ride; busy: string | null; run: (k: string, fn: () => PromiseLike<{ error: unknown }>) => Promise<void> }) {
  const [contact, setContact] = React.useState<Contact | null>(null);
  const next = NEXT[ride.status];

  React.useEffect(() => {
    supabase.rpc("mova_ride_contact", { p_ride_id: ride.id }).then(({ data }) => setContact((data as Contact[] | null)?.[0] ?? null));
  }, [ride.id]);

  return (
    <View style={{ gap: 12 }}>
      <Card>
        <Label>{next?.title ?? "Course"} · n° {ride.id}</Label>
        <Text style={{ fontSize: 22, fontWeight: "900", color: C.fg }}>Passager : {contact?.first_name ?? "…"}</Text>
        <RideRoute ride={ride} />
      </Card>
      {next && (
        <Button
          title={next.label}
          variant={next.status === "completed" ? "signal" : "primary"}
          busy={busy === "advance"}
          onPress={() => run("advance", () => supabase.rpc("mova_advance_ride", { p_ride_id: ride.id, p_status: next.status }))}
        />
      )}
      {(ride.status === "accepted" || ride.status === "arriving") && (
        <Button title="Annuler la course" variant="outline" busy={busy === "cancel"} onPress={() => run("cancel", () => supabase.rpc("mova_cancel_ride", { p_ride_id: ride.id }))} />
      )}
    </View>
  );
}
