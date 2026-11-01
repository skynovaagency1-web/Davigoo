import * as React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { usePolling } from "../hooks";
import { CATEGORIES, PLACES, euro, previewPrice, type Place } from "../places";
import { ACTIVE, errorText, supabase, type CategoryId, type Contact, type Profile, type Ride } from "../supabase";
import { Body, Button, C, Card, Chip, ErrorText, Label, SERIF, Title } from "../ui";
import { Header } from "./Header";
import { RideRoute } from "./RideRoute";
import { Account } from "./Account";
import { Rudder, RUDDER_SPACE } from "./Rudder";

const STATUS: Record<Ride["status"], { title: string; text: string }> = {
  requested: { title: "Recherche d'un chauffeur…", text: "Votre demande est envoyée aux chauffeurs MOVA en ligne." },
  accepted: { title: "Chauffeur trouvé", text: "Votre chauffeur se prépare à venir vous chercher." },
  arriving: { title: "Votre chauffeur arrive", text: "Rendez-vous au point de prise en charge." },
  in_progress: { title: "En route", text: "Bon trajet avec MOVA." },
  completed: { title: "Vous êtes arrivé", text: "Le paiement n'est pas encore géré dans l'application pilote." },
  cancelled: { title: "Course annulée", text: "" },
};

export function Passenger({ profile }: { profile: Profile }) {
  const [ride, setRide] = React.useState<Ride | null | undefined>(undefined);
  const [dismissed, setDismissed] = React.useState<number | null>(null);
  const [tab, setTab] = React.useState<"ride" | "account">("ride");
  const [bookKey, setBookKey] = React.useState(0);

  const load = React.useCallback(async () => {
    const { data } = await supabase
      .from("mova_rides")
      .select("*")
      .eq("passenger_id", profile.user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setRide((data as Ride | null) ?? null);
  }, [profile.user_id]);

  const active = ride && (ACTIVE.includes(ride.status) || ride.id !== dismissed);
  usePolling(load, active && ride && ACTIVE.includes(ride.status) ? 4000 : 30000);

  return (
    <View style={{ flex: 1 }}>
      <Header name={profile.first_name} subtitle="Passager" />
      {tab === "account" ? (
        <Account profile={profile} />
      ) : ride === undefined ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={C.primary} />
      ) : ride && active ? (
        <CurrentRide ride={ride} onChange={setRide} onClose={() => setDismissed(ride.id)} />
      ) : (
        <Book key={bookKey} onBooked={setRide} />
      )}
      <Rudder
        left={{ icon: "route", label: "Course", active: tab === "ride", onPress: () => setTab("ride") }}
        center={{
          icon: "plus",
          label: "Nouvelle course",
          onPress: () => {
            setTab("ride");
            if (ride && !ACTIVE.includes(ride.status)) setDismissed(ride.id);
            if (!ride || !ACTIVE.includes(ride.status)) setBookKey((k) => k + 1);
          },
        }}
        right={{ icon: "person", label: "Compte", active: tab === "account", onPress: () => setTab("account") }}
      />
    </View>
  );
}

function PlacePicker({ label, value, onChange, exclude }: { label: string; value: Place | null; onChange: (p: Place) => void; exclude?: Place | null }) {
  return (
    <View style={{ gap: 10 }}>
      <Label>{label}</Label>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {PLACES.filter((p) => p.id !== exclude?.id).map((p) => (
          <Chip key={p.id} label={p.short} active={value?.id === p.id} onPress={() => onChange(p)} />
        ))}
      </View>
    </View>
  );
}

function Book({ onBooked }: { onBooked: (r: Ride) => void }) {
  const [from, setFrom] = React.useState<Place | null>(null);
  const [to, setTo] = React.useState<Place | null>(null);
  const [category, setCategory] = React.useState<CategoryId>("standard");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const est = from && to ? previewPrice(from, to, category) : null;

  const book = async () => {
    if (!from || !to) return;
    setBusy(true);
    setError("");
    const { data, error } = await supabase.rpc("mova_request_ride", {
      p_pickup_label: from.label,
      p_pickup_lat: from.lat,
      p_pickup_lng: from.lng,
      p_dropoff_label: to.label,
      p_dropoff_lat: to.lat,
      p_dropoff_lng: to.lng,
      p_category: category,
    });
    setBusy(false);
    if (error) return setError(errorText(error));
    onBooked(data as Ride);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 22, paddingBottom: RUDDER_SPACE }}>
      <Title>Où allez-vous ?</Title>
      <PlacePicker label="Départ" value={from} onChange={(p) => { setFrom(p); if (to?.id === p.id) setTo(null); }} />
      <PlacePicker label="Arrivée" value={to} onChange={setTo} exclude={from} />
      <View style={{ gap: 10 }}>
        <Label>Catégorie</Label>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} label={`${c.label} · ${c.hint}`} active={category === c.id} onPress={() => setCategory(c.id)} />
          ))}
        </View>
      </View>
      {est && (
        <Card>
          <Label>Estimation</Label>
          <Text style={{ fontFamily: SERIF, fontSize: 42, color: C.fg }}>≈ {euro(est.price)}</Text>
          <Body muted>
            {String(est.km).replace(".", ",")} km · {est.minutes} min{est.night ? " · tarif soirée" : ""}. Tarif pilote, à titre indicatif.
          </Body>
        </Card>
      )}
      <ErrorText>{error}</ErrorText>
      <Button title="Commander" onPress={book} busy={busy} disabled={!from || !to} />
    </ScrollView>
  );
}

function CurrentRide({ ride, onChange, onClose }: { ride: Ride; onChange: (r: Ride) => void; onClose: () => void }) {
  const [contact, setContact] = React.useState<Contact | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const st = STATUS[ride.status];

  React.useEffect(() => {
    if (!ride.driver_id || ride.status === "cancelled") return setContact(null);
    supabase.rpc("mova_ride_contact", { p_ride_id: ride.id }).then(({ data }) => setContact((data as Contact[] | null)?.[0] ?? null));
  }, [ride.id, ride.driver_id, ride.status]);

  const cancel = async () => {
    setBusy(true);
    setError("");
    const { data, error } = await supabase.rpc("mova_cancel_ride", { p_ride_id: ride.id });
    setBusy(false);
    if (error) return setError(errorText(error));
    onChange(data as Ride);
  };

  const cancelText = ride.status === "cancelled" ? (ride.cancelled_by === "driver" ? "Le chauffeur a annulé la course. Vous pouvez en commander une autre." : "Vous avez annulé cette course.") : st.text;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: RUDDER_SPACE }}>
      <Card dark>
        <Text style={{ color: C.accentOnDark, fontSize: 11, letterSpacing: 1.6, fontWeight: "600", textTransform: "uppercase" }}>Course n° {ride.id}</Text>
        <Text style={{ color: C.boardFg, fontFamily: SERIF, fontSize: 32 }}>{st.title}</Text>
        {!!cancelText && <Text style={{ color: "#B5A898", fontSize: 15 }}>{cancelText}</Text>}
        {ride.status === "requested" && <ActivityIndicator color={C.accentOnDark} style={{ alignSelf: "flex-start" }} />}
      </Card>
      {contact && ride.status !== "completed" && (
        <Card>
          <Label>Votre chauffeur</Label>
          <Text style={{ fontFamily: SERIF, fontSize: 26, color: C.fg }}>{contact.first_name}</Text>
          <Body>
            {contact.vehicle} · <Text style={{ fontWeight: "600", letterSpacing: 1.2 }}>{contact.plate}</Text>
          </Body>
        </Card>
      )}
      <Card>
        <RideRoute ride={ride} />
      </Card>
      <ErrorText>{error}</ErrorText>
      {["requested", "accepted", "arriving"].includes(ride.status) && <Button title="Annuler la course" variant="outline" onPress={cancel} busy={busy} />}
      {["completed", "cancelled"].includes(ride.status) && <Button title="Nouvelle course" onPress={onClose} />}
    </ScrollView>
  );
}
