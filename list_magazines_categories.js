const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://rkecfnssedbsccpynwwx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZWNmbnNzZWRic2NjcHlud3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI2ODEsImV4cCI6MjA5NTY4ODY4MX0.SFIqUf-kKs7SLX-I39ZJ1E3nYFFM9qMGnSEZQKhvmvY";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.from('magazines').select('id, title, issue, description, category');
  if (error) {
    console.error(error);
    return;
  }
  
  console.log("Magazines in database:");
  data.forEach(m => {
    console.log(`- ID: ${m.id} | Title: "${m.title}" | Issue: "${m.issue}" | Desc: "${m.description}" | Category: "${m.category}"`);
  });
}

main();
