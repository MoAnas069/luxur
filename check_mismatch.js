const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://rkecfnssedbsccpynwwx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZWNmbnNzZWRic2NjcHlud3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI2ODEsImV4cCI6MjA5NTY4ODY4MX0.SFIqUf-kKs7SLX-I39ZJ1E3nYFFM9qMGnSEZQKhvmvY";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.from('photos').select('*');
  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(`Checking ${data.length} photos...`);
  let remoteSuccess = 0;
  let remoteFail = 0;
  
  // Check the first 10 remote URLs
  const remoteUrls = data.filter(p => !p.image_url.includes('magazine_img_') && !p.image_url.startsWith('/'));
  console.log(`Found ${remoteUrls.length} remote URLs.`);
  
  for (const photo of remoteUrls.slice(0, 10)) {
    try {
      const res = await fetch(photo.image_url, { method: 'HEAD' });
      if (res.status === 200) {
        remoteSuccess++;
      } else {
        console.log(`❌ Fail: ${photo.image_url} returned status ${res.status}`);
        remoteFail++;
      }
    } catch (err) {
      console.log(`❌ Fail (Error): ${photo.image_url} -> ${err.message}`);
      remoteFail++;
    }
  }
  
  console.log(`Results: ${remoteSuccess} success, ${remoteFail} fail.`);
}

main();
