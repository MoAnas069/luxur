import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rkecfnssedbsccpynwwx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZWNmbnNzZWRic2NjcHlud3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI2ODEsImV4cCI6MjA5NTY4ODY4MX0.SFIqUf-kKs7SLX-I39ZJ1E3nYFFM9qMGnSEZQKhvmvY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
