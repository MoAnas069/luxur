async function main() {
  const url = 'https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/photos/1780155597435-product-23.webp';
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Body:`, text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

main();
