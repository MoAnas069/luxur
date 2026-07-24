const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://rkecfnssedbsccpynwwx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZWNmbnNzZWRic2NjcHlud3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI2ODEsImV4cCI6MjA5NTY4ODY4MX0.SFIqUf-kKs7SLX-I39ZJ1E3nYFFM9qMGnSEZQKhvmvY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking photos...");
  const { data: photos, error: pErr } = await supabase.from("photos").select("*");
  if (pErr) console.error("Photos error:", pErr);
  else console.log(`Photos found: ${photos.length}`, photos.slice(0, 3));

  console.log("Checking magazines...");
  const { data: mags, error: mErr } = await supabase.from("magazines").select("*");
  if (mErr) console.error("Magazines error:", mErr);
  else console.log(`Magazines found: ${mags.length}`, mags.slice(0, 3));
}

check();
