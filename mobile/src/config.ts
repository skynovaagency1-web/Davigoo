// Public Supabase settings (same project as the website). The publishable key is safe to ship:
// row level security and the mova_* database functions decide what each account can do.
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "https://qhccclcgzatoexnuneue.supabase.co";
export const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? "sb_publishable_-Sv3Z28P3ysB6yPbwcf82g_Jh0-aZiD";
