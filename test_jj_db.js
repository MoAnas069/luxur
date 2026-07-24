const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://eyycquaeknhbarasnseh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eWNxdWFla25oYmFyYXNuc2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNDkxMDEsImV4cCI6MjA5NjcyNTEwMX0.gLR0wB49JsiRYLEMLZprn5AnI7ZjuGIzWI9821gE33c";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking photos in The JJ...");
  const { data: photos, error: pErr } = await supabase.from("photos").select("*");
  if (pErr) console.error("Photos error:", pErr);
  else console.log(`Photos found: ${photos.length}`, photos.slice(0, 3));

  console.log("Checking magazines in The JJ...");
  const { data: mags, error: mErr } = await supabase.from("magazines").select("*");
  if (mErr) console.error("Magazines error:", mErr);
  else console.log(`Magazines found: ${mags.length}`, mags.slice(0, 3));
}

check();
