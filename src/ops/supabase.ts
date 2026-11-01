import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase-config";

// Read before the client consumes the URL: invite, recovery and magic links must end with choosing a password.
export const ARRIVED_FROM_EMAIL_LINK =
  typeof window !== "undefined" && /type=(invite|recovery|magiclink|signup)/.test(window.location.hash);

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: "mova-ops-auth" },
});

export type SignupStatus = "new" | "contacted" | "interview" | "committed" | "declined";

export type SignupRow = {
  id: number;
  created_at: string;
  kind: "passenger" | "driver";
  first_name: string | null;
  email: string;
  phone: string | null;
  commune: string | null;
  details: string | null;
  has_vtc_card: boolean | null;
  status: SignupStatus;
  notes: string | null;
  updated_at: string;
};

export const STATUS_LABELS: Record<SignupStatus, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  interview: "Entretien",
  committed: "Engagé",
  declined: "Abandon",
};

export const PASSENGER_STATUSES: SignupStatus[] = ["new", "contacted", "declined"];
export const DRIVER_STATUSES: SignupStatus[] = ["new", "contacted", "interview", "committed", "declined"];
