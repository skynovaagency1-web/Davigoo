import * as React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { supabase } from "../supabase";
import { Body, Button, ErrorText, Field, Title } from "../ui";

// Sign-in with a 6-digit code sent by e-mail. New e-mails create an account.
export function Login() {
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  const send = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return setError("Adresse e-mail invalide.");
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({ email: e, options: { shouldCreateUser: true } });
    setBusy(false);
    if (error) return setError(error.status === 429 ? "Trop de demandes. Réessayez dans quelques minutes." : "Envoi impossible. Réessayez.");
    setEmail(e);
    setSent(true);
  };

  const verify = async () => {
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({ email, token: code.replace(/\s/g, ""), type: "email" });
    setBusy(false);
    if (error) setError("Code incorrect ou expiré.");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, justifyContent: "center", padding: 24, gap: 24 }}>
      <View style={{ gap: 6 }}>
        <Title style={{ fontSize: 44 }}>MOVA</Title>
        <Body muted>Version pilote · Besançon</Body>
      </View>
      {!sent ? (
        <View style={{ gap: 16 }}>
          <Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" placeholder="vous@exemple.fr" />
          <ErrorText>{error}</ErrorText>
          <Button title="Recevoir un code" onPress={send} busy={busy} />
        </View>
      ) : (
        <View style={{ gap: 16 }}>
          <Body>Code envoyé à {email}. Il est valable une heure.</Body>
          <Field label="Code à 6 chiffres" value={code} onChangeText={setCode} keyboardType="number-pad" autoComplete="one-time-code" textContentType="oneTimeCode" maxLength={8} placeholder="000000" />
          <ErrorText>{error}</ErrorText>
          <Button title="Valider" onPress={verify} busy={busy} disabled={code.replace(/\s/g, "").length < 6} />
          <Button title="Changer d'e-mail" variant="outline" onPress={() => { setSent(false); setCode(""); setError(""); }} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
