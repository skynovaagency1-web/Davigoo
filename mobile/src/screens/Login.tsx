import * as React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { supabase } from "../supabase";
import { Body, Button, Chip, ErrorText, Field, Title } from "../ui";

// E-mail + password sign-in. The pilot runs without a custom e-mail service, so Supabase's
// "Confirm email" setting is off; one-time codes come back once a sending service is connected.
export function Login() {
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  const submit = async () => {
    const e = email.trim().toLowerCase();
    setError("");
    setNotice("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return setError("Adresse e-mail invalide.");
    if (password.length < 8) return setError("Mot de passe : 8 caractères minimum.");
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email: e, password });
      setBusy(false);
      if (error) setError(error.status === 429 ? "Trop de tentatives. Réessayez dans quelques minutes." : "E-mail ou mot de passe incorrect.");
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email: e, password });
    setBusy(false);
    if (error) {
      if (/already|registered|exists/i.test(error.message)) return setError("Un compte existe déjà avec cet e-mail. Connectez-vous.");
      if (/password/i.test(error.message)) return setError("Mot de passe trop faible. Choisissez-en un plus long.");
      return setError("Création du compte impossible. Réessayez.");
    }
    if (!data.session) setNotice("Compte créé. Confirmez votre adresse via l'e-mail reçu, puis connectez-vous.");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24, gap: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ gap: 6 }}>
          <Title style={{ fontSize: 44 }}>MOVA</Title>
          <Body muted>Version pilote · Besançon</Body>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Chip label="Se connecter" active={mode === "signin"} onPress={() => { setMode("signin"); setError(""); setNotice(""); }} />
          <Chip label="Créer un compte" active={mode === "signup"} onPress={() => { setMode("signup"); setError(""); setNotice(""); }} />
        </View>
        <View style={{ gap: 16 }}>
          <Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" placeholder="vous@exemple.fr" />
          <Field
            label={mode === "signup" ? "Mot de passe (8 caractères minimum)" : "Mot de passe"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            textContentType={mode === "signup" ? "newPassword" : "password"}
          />
          <ErrorText>{error}</ErrorText>
          {!!notice && <Body>{notice}</Body>}
          <Button title={mode === "signup" ? "Créer mon compte" : "Se connecter"} onPress={submit} busy={busy} />
          {mode === "signin" && <Body muted>Mot de passe oublié ? Écrivez à l'équipe MOVA pendant le pilote.</Body>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
