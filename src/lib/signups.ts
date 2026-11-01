// Waitlist sign-ups are stored in Supabase (table public.mova_signups, insert-only for visitors).
// The publishable key is meant to be public; row level security only allows inserts.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://scixaxatkvwihedzukma.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY ?? "sb_publishable_uPjoYqzAW16IPOSan-YzTQ_VdxV5PfS";

export type Signup = {
  kind: "passenger" | "driver";
  email: string;
  first_name?: string;
  phone?: string;
  commune?: string;
  details?: string;
  has_vtc_card?: boolean;
  consent: true;
};

const clean = (v?: string) => (v && v.trim() ? v.trim() : undefined);

export async function submitSignup(s: Signup): Promise<void> {
  const body = {
    ...s,
    email: s.email.trim().toLowerCase(),
    first_name: clean(s.first_name),
    phone: clean(s.phone),
    commune: clean(s.commune),
    details: clean(s.details),
  };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/mova_signups`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Signup failed (${res.status})`);
}

export const SIGNUP_ERROR =
  "L'inscription n'a pas pu être envoyée. Vérifiez votre connexion et votre e-mail, puis réessayez.";
