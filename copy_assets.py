import os
import shutil
import json
import urllib.request

# Source Directories
mag_creator_workspace = r"C:\Users\anuma\Desktop\mag creator"
furniture_dir = os.path.join(mag_creator_workspace, "FURNITURE-20260615T015430Z-3-001", "FURNITURE")
lights_dir = os.path.join(mag_creator_workspace, "LIGHTS-20260615T015451Z-3-001", "LIGHTS")
others_dir = os.path.join(mag_creator_workspace, "OTHERS-20260615T015745Z-3-001", "OTHERS")

# Destination Directories
desktop_magazines_dir = r"C:\Users\anuma\Desktop\magazines"
luxura_dir = r"C:\Users\anuma\Desktop\luxurafurniture"
luxura_magazines_dir = os.path.join(luxura_dir, "public", "magazines")
luxura_images_dir = os.path.join(luxura_dir, "public", "images")

os.makedirs(luxura_magazines_dir, exist_ok=True)
os.makedirs(desktop_magazines_dir, exist_ok=True)
os.makedirs(luxura_images_dir, exist_ok=True)

# Complete list of 49 volumes (FURNITURE, LIGHTS, and OTHERS)
volumes = [
    # --- FURNITURE (Original 6) ---
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_1_Anni",
        "html_src": "LUXURA_Volume_1.html",
        "vol_num": 10,
        "title": "Anni Collection",
        "issue": "Italian Coffee & Dining Table Series",
        "description": "Bespoke curated lookbook for Anni series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_5_Cassie",
        "html_src": "LUXURA_Volume_5.html",
        "vol_num": 11,
        "title": "Cassie Collection",
        "issue": "Coffee Table & Living Series",
        "description": "Bespoke curated lookbook for Cassie series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_6_Eco",
        "html_src": "LUXURA_Volume_6.html",
        "vol_num": 12,
        "title": "Eco Dining Series",
        "issue": "Eco Sustainable Dining Series",
        "description": "Bespoke curated lookbook for Eco Dining Series.",
        "category": "Dining"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_6a_Eco_Dining",
        "html_src": "LUXURA_Volume_6a.html",
        "vol_num": 13,
        "title": "Eco Dining Luxury Series",
        "issue": "Eco Sustainable Dining Luxury Series",
        "description": "Bespoke curated lookbook for Eco Dining Luxury Series.",
        "category": "Dining"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_24_Ufan",
        "html_src": "LUXURA_Volume_24.html",
        "vol_num": 14,
        "title": "Ufan Beds Collection",
        "issue": "Modern Ufan Beds Series",
        "description": "Bespoke curated lookbook for Ufan Beds Series.",
        "category": "Bed"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_27_Dining",
        "html_src": "LUXURA_Volume_27.html",
        "vol_num": 15,
        "title": "2026 Dining Catalog",
        "issue": "Modern Dining Series",
        "description": "Bespoke curated lookbook for Modern Dining Series.",
        "category": "Dining"
    },

    # --- FURNITURE (Remaining 25 unique PDFs, minus index 24 & 27 which are handled above) ---
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_7_Lilyaiji-bedside_table",
        "html_src": "LUXURA_Volume_7.html",
        "vol_num": 16,
        "title": "Lilyaiji Bedside Table",
        "issue": "Bespoke Bedside Cabinet Series",
        "description": "Bespoke curated lookbook for Lilyaiji Bedside Table series.",
        "category": "Bed"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_8_Lilyaiji-cabinets",
        "html_src": "LUXURA_Volume_8.html",
        "vol_num": 17,
        "title": "Lilyaiji Cabinets",
        "issue": "Luxury Storage & Credenza Series",
        "description": "Bespoke curated lookbook for Lilyaiji Cabinets series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_9_Lilyaiji-designer_cabinet",
        "html_src": "LUXURA_Volume_9.html",
        "vol_num": 18,
        "title": "Lilyaiji Designer Cabinet",
        "issue": "Artisanal Credenza & Accent Cabinets",
        "description": "Bespoke curated lookbook for Lilyaiji Designer Cabinet series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_10_Lilyaiji-dresser",
        "html_src": "LUXURA_Volume_10.html",
        "vol_num": 19,
        "title": "Lilyaiji Dresser",
        "issue": "Bespoke Dressers & Vanity Series",
        "description": "Bespoke curated lookbook for Lilyaiji Dresser series.",
        "category": "Bed"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_11_LU_bed",
        "html_src": "LUXURA_Volume_11.html",
        "vol_num": 20,
        "title": "Lu Bed Collection",
        "issue": "Modern Luxury Bedstead Series",
        "description": "Bespoke curated lookbook for Lu Bed series.",
        "category": "Bed"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_12_LU_Sofa",
        "html_src": "LUXURA_Volume_12.html",
        "vol_num": 21,
        "title": "Lu Sofa Collection",
        "issue": "Contemporary Sofa & Sectional Series",
        "description": "Bespoke curated lookbook for Lu Sofa series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_13_LU-Desiner_-_dining",
        "html_src": "LUXURA_Volume_13.html",
        "vol_num": 22,
        "title": "Lu Designer Dining",
        "issue": "Architectural Dining Table & Chair Series",
        "description": "Bespoke curated lookbook for Lu Designer Dining series.",
        "category": "Dining"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_14_MEI-BEDS",
        "html_src": "LUXURA_Volume_14.html",
        "vol_num": 23,
        "title": "Mei Beds Collection",
        "issue": "Contemporary Luxury Bedsteads",
        "description": "Bespoke curated lookbook for Mei Beds series.",
        "category": "Bed"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_15_Becqi",
        "html_src": "LUXURA_Volume_15.html",
        "vol_num": 24,
        "title": "Becqi Collection",
        "issue": "Sculptural Seating & Accent Chairs",
        "description": "Bespoke curated lookbook for Becqi series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_16_MEI-CHAIR",
        "html_src": "LUXURA_Volume_16.html",
        "vol_num": 25,
        "title": "Mei Chair Collection",
        "issue": "Contemporary Dining & Armchair Series",
        "description": "Bespoke curated lookbook for Mei Chair series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_17_MEI-COFFEE_TABLE",
        "html_src": "LUXURA_Volume_17.html",
        "vol_num": 26,
        "title": "Mei Coffee Table Collection",
        "issue": "Modern Coffee & Side Table Series",
        "description": "Bespoke curated lookbook for Mei Coffee Table series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_18_Michale-Designer_living_room_chair_series",
        "html_src": "LUXURA_Volume_18.html",
        "vol_num": 27,
        "title": "Michale Designer Living Room Chair Series",
        "issue": "Artisanal Living Room Seating",
        "description": "Bespoke curated lookbook for Michale Designer Living Room Chair series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_19_Wine_cabinets__Route",
        "html_src": "LUXURA_Volume_19.html",
        "vol_num": 28,
        "title": "Wine Cabinets Route",
        "issue": "Exclusive Wine Storage & Bar Cabinets",
        "description": "Bespoke curated lookbook for Wine Cabinets Route series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_20_CABINETS",
        "html_src": "LUXURA_Volume_20.html",
        "vol_num": 29,
        "title": "Cabinets Collection",
        "issue": "Luxury Storage & Credenza Catalog",
        "description": "Bespoke curated lookbook for Cabinets series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_21_Cassie-_Luxury_Bed_Catalog",
        "html_src": "LUXURA_Volume_21.html",
        "vol_num": 30,
        "title": "Cassie Luxury Bed Catalog",
        "issue": "Premium Luxury Bedstead Catalog",
        "description": "Bespoke curated lookbook for Cassie Luxury Bed series.",
        "category": "Bed"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_22_Kikiven-ivenaop34",
        "html_src": "LUXURA_Volume_22.html",
        "vol_num": 31,
        "title": "Kikiven Collection",
        "issue": "Bespoke Modern Living Catalog",
        "description": "Bespoke curated lookbook for Kikiven series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_23_Accent_Chairs",
        "html_src": "LUXURA_Volume_23.html",
        "vol_num": 32,
        "title": "Accent Chairs Collection",
        "issue": "Luxury Armchairs & Seating Series",
        "description": "Bespoke curated lookbook for Accent Chairs series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_24_Cassie-_Bar_Chair",
        "html_src": "LUXURA_Volume_24.html",
        "vol_num": 33,
        "title": "Cassie Bar Chair Collection",
        "issue": "Luxury Bar Stool & Counter Chair Series",
        "description": "Bespoke curated lookbook for Cassie Bar Chair series.",
        "category": "Dining"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_25_Cassie-_Leisure_Chair_Catalog",
        "html_src": "LUXURA_Volume_25.html",
        "vol_num": 34,
        "title": "Cassie Leisure Chair Catalog",
        "issue": "Contemporary Leisure Chair Series",
        "description": "Bespoke curated lookbook for Cassie Leisure Chair series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_26_Chairs",
        "html_src": "LUXURA_Volume_26.html",
        "vol_num": 35,
        "title": "Chairs Collection",
        "issue": "Modern Armchairs & Dining Seating",
        "description": "Bespoke curated lookbook for Chairs series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_28_DR_Coffee_Table",
        "html_src": "LUXURA_Volume_28.html",
        "vol_num": 36,
        "title": "DR Coffee Table Collection",
        "issue": "Contemporary Coffee & End Table Series",
        "description": "Bespoke curated lookbook for DR Coffee Table series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_29_LUXE_Collection",
        "html_src": "LUXURA_Volume_29.html",
        "vol_num": 37,
        "title": "Luxe Collection",
        "issue": "Bespoke Furniture Showpiece Catalog",
        "description": "Bespoke curated lookbook for Luxe Collection series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_30_OFFICE_FURNITURES",
        "html_src": "LUXURA_Volume_30.html",
        "vol_num": 38,
        "title": "Office Furnitures Collection",
        "issue": "Luxury Executive Desks & Office Seating",
        "description": "Bespoke curated lookbook for Office Furnitures series.",
        "category": "Office"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_31_paiyi",
        "html_src": "LUXURA_Volume_31.html",
        "vol_num": 39,
        "title": "Paiyi Collection",
        "issue": "Exclusive Sculptural Furnishings",
        "description": "Bespoke curated lookbook for Paiyi series.",
        "category": "Living"
    },
    {
        "parent": furniture_dir,
        "folder": "LUXURA_Volume_32_Dining",
        "html_src": "LUXURA_Volume_32.html",
        "vol_num": 40,
        "title": "Dining Collection",
        "issue": "Premium Dining Table & Seating Series",
        "description": "Bespoke curated lookbook for Dining series.",
        "category": "Dining"
    },

    # --- LIGHTS (8 volumes) ---
    {
        "parent": lights_dir,
        "folder": "LUXURA_Volume_34_AURA_canada__",
        "html_src": "LUXURA_Volume_34.html",
        "vol_num": 41,
        "title": "Aura Canada Lighting",
        "issue": "Exclusive Architectural Lighting Series",
        "description": "Bespoke curated lookbook for Aura Canada series.",
        "category": "Lighting"
    },
    {
        "parent": lights_dir,
        "folder": "LUXURA_Volume_35_HALO_series__canada",
        "html_src": "LUXURA_Volume_35.html",
        "vol_num": 42,
        "title": "Halo Series Canada Lighting",
        "issue": "Exclusive Halo Pendant & Spotlight Series",
        "description": "Bespoke curated lookbook for Halo Series Canada series.",
        "category": "Lighting"
    },
    {
        "parent": lights_dir,
        "folder": "LUXURA_Volume_36_CHEN_LG",
        "html_src": "LUXURA_Volume_36.html",
        "vol_num": 43,
        "title": "Chen Lg Lighting",
        "issue": "Contemporary Designer Lighting Catalog",
        "description": "Bespoke curated lookbook for Chen Lg series.",
        "category": "Lighting"
    },
    {
        "parent": lights_dir,
        "folder": "LUXURA_Volume_37_Daisy_ED900_selections",
        "html_src": "LUXURA_Volume_37.html",
        "vol_num": 44,
        "title": "Daisy Ed900 Selections",
        "issue": "Premium Luxury Chandelier Catalog",
        "description": "Bespoke curated lookbook for Daisy Ed900 Selections series.",
        "category": "Lighting"
    },
    {
        "parent": lights_dir,
        "folder": "LUXURA_Volume_38_JENN_I",
        "html_src": "LUXURA_Volume_38.html",
        "vol_num": 45,
        "title": "Jenn I Lighting",
        "issue": "Bespoke Luxury Pendant Series",
        "description": "Bespoke curated lookbook for Jenn I series.",
        "category": "Lighting"
    },
    {
        "parent": lights_dir,
        "folder": "LUXURA_Volume_39_JENN_II",
        "html_src": "LUXURA_Volume_39.html",
        "vol_num": 46,
        "title": "Jenn Ii Lighting",
        "issue": "Exclusive Pendant & Table Light Series",
        "description": "Bespoke curated lookbook for Jenn Ii series.",
        "category": "Lighting"
    },
    {
        "parent": lights_dir,
        "folder": "LUXURA_Volume_40_Mili_OUTDOOR",
        "html_src": "LUXURA_Volume_40.html",
        "vol_num": 47,
        "title": "Mili Outdoor Lighting",
        "issue": "Exclusive Outdoor & Landscape Light Series",
        "description": "Bespoke curated lookbook for Mili Outdoor series.",
        "category": "Lighting"
    },
    {
        "parent": lights_dir,
        "folder": "LUXURA_Volume_41_Xana",
        "html_src": "LUXURA_Volume_41.html",
        "vol_num": 48,
        "title": "Xana Lighting",
        "issue": "Modern Sculptural Light Series",
        "description": "Bespoke curated lookbook for Xana series.",
        "category": "Lighting"
    },

    # --- OTHERS (10 volumes) ---
    {
        "parent": others_dir,
        "folder": "LUXURA_Volume_42_CUSTOM_MADE__RUGS_processed",
        "html_src": "LUXURA_Volume_42.html",
        "vol_num": 49,
        "title": "Custom Made Rugs",
        "issue": "Premium Custom Rugs & Textures",
        "description": "Bespoke curated lookbook for Custom Made Rugs series.",
        "category": "Decor"
    },
    {
        "parent": others_dir,
        "folder": "LUXURA_Volume_43_Designer_Carpets",
        "html_src": "LUXURA_Volume_43.html",
        "vol_num": 50,
        "title": "Designer Carpets",
        "issue": "Luxury Architectural Floor Carpets",
        "description": "Bespoke curated lookbook for Designer Carpets series.",
        "category": "Decor"
    },
    {
        "parent": others_dir,
        "folder": "LUXURA_Volume_44_DESIGNER_RUGS",
        "html_src": "LUXURA_Volume_44.html",
        "vol_num": 51,
        "title": "Designer Rugs",
        "issue": "Bespoke Contemporary Designer Rugs",
        "description": "Bespoke curated lookbook for Designer Rugs series.",
        "category": "Decor"
    },
    {
        "parent": others_dir,
        "folder": "LUXURA_Volume_45_Acquarium",
        "html_src": "LUXURA_Volume_45.html",
        "vol_num": 52,
        "title": "Acquarium Showcase",
        "issue": "Bespoke Luxury Aquarium Systems",
        "description": "Bespoke curated lookbook for Acquarium series.",
        "category": "Decor"
    },
    {
        "parent": others_dir,
        "folder": "LUXURA_Volume_46_CABINETS",
        "html_src": "LUXURA_Volume_46.html",
        "vol_num": 53,
        "title": "Cabinets Series 2",
        "issue": "Luxury Storage & Wall Cabinets",
        "description": "Bespoke curated lookbook for Cabinets series.",
        "category": "Living"
    },
    {
        "parent": others_dir,
        "folder": "LUXURA_Volume_47_LAR_Artificial_Plants_Series_1",
        "html_src": "LUXURA_Volume_47.html",
        "vol_num": 54,
        "title": "Lar Artificial Plants Series 1",
        "issue": "Bespoke Premium Artificial Foliage",
        "description": "Bespoke curated lookbook for Lar Artificial Plants Series 1 series.",
        "category": "Decor"
    },
    {
        "parent": others_dir,
        "folder": "LUXURA_Volume_48_LAR_Artificial_Plants_Series_7",
        "html_src": "LUXURA_Volume_48.html",
        "vol_num": 55,
        "title": "Lar Artificial Plants Series 7",
        "issue": "Bespoke Premium Artificial Ficus & Palms",
        "description": "Bespoke curated lookbook for Lar Artificial Plants Series 7 series.",
        "category": "Decor"
    },
    {
        "parent": others_dir,
        "folder": "LUXURA_Volume_49_LAR_Pots_Series_2",
        "html_src": "LUXURA_Volume_49.html",
        "vol_num": 56,
        "title": "Lar Pots Series 2",
        "issue": "Sculptural Planters & Pots Series",
        "description": "Bespoke curated lookbook for Lar Pots Series 2 series.",
        "category": "Decor"
    },
    {
        "parent": others_dir,
        "folder": "LUXURA_Volume_50_LAR_Water_Fountains",
        "html_src": "LUXURA_Volume_50.html",
        "vol_num": 57,
        "title": "Lar Water Fountains",
        "issue": "Architectural Indoor Water Fountains",
        "description": "Bespoke curated lookbook for Lar Water Fountains series.",
        "category": "Decor"
    },
    {
        "parent": others_dir,
        "folder": "LUXURA_Volume_51_SMART_TOILETS",
        "html_src": "LUXURA_Volume_51.html",
        "vol_num": 58,
        "title": "Smart Toilets Collection",
        "issue": "Contemporary Intelligent Sanitaryware",
        "description": "Bespoke curated lookbook for Smart Toilets series.",
        "category": "Decor"
    }
]

sql_inserts = []
upsert_payload = []

print(f"Beginning asset copy for {len(volumes)} volumes...")

for vol in volumes:
    vol_num = vol["vol_num"]
    folder_path = os.path.join(vol["parent"], vol["folder"])
    
    if not os.path.exists(folder_path):
        print(f"Warning: Directory {folder_path} not found! Skipping copy.")
        continue
        
    src_html = os.path.join(folder_path, vol["html_src"])
    src_cover = os.path.join(folder_path, "Cover_Hero_2x3.jpg")
    if not os.path.exists(src_cover):
        src_cover = os.path.join(folder_path, "Cover_Hero.jpg")
        
    # Destinations
    dest_desktop_html = os.path.join(desktop_magazines_dir, f"volume {vol_num}.html")
    dest_luxura_html = os.path.join(luxura_magazines_dir, f"volume-{vol_num}.html")
    dest_luxura_cover = os.path.join(luxura_images_dir, f"mag_cover_volume_{vol_num}.jpg")
    
    # Copy HTML files
    if os.path.exists(src_html):
        shutil.copy2(src_html, dest_desktop_html)
        shutil.copy2(src_html, dest_luxura_html)
    else:
        print(f"  Error: Source HTML {src_html} not found!")
        
    # Copy Cover images
    if os.path.exists(src_cover):
        shutil.copy2(src_cover, dest_luxura_cover)
    else:
        print(f"  Error: Source Cover Image {src_cover} not found!")
        
    # SQL query preparation
    uuid_str = f"d10b00{vol_num:02d}-00{vol_num:02d}-00{vol_num:02d}-00{vol_num:02d}-001000100010"
    
    sql = (f"INSERT INTO magazines (id, title, issue, description, cover_url, cover_path, pdf_url, pdf_path, published_at, is_active, category) "
           f"VALUES ('{uuid_str}', '{vol['title']}', '{vol['issue']}', '{vol['description']}', "
           f"'/images/mag_cover_volume_{vol_num}.jpg', 'covers/mag_cover_volume_{vol_num}.jpg', "
           f"'/magazines/volume-{vol_num}.html', 'pdf/volume-{vol_num}.html', '2026-06-17', true, '{vol['category']}') "
           f"ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, issue=EXCLUDED.issue, description=EXCLUDED.description, "
           f"cover_url=EXCLUDED.cover_url, pdf_url=EXCLUDED.pdf_url, category=EXCLUDED.category;")
    sql_inserts.append(sql)
    
    # JSON payload for direct postgrest upsert
    upsert_payload.append({
        "id": uuid_str,
        "title": vol["title"],
        "issue": vol["issue"],
        "description": vol["description"],
        "cover_url": f"/images/mag_cover_volume_{vol_num}.jpg",
        "cover_path": f"covers/mag_cover_volume_{vol_num}.jpg",
        "pdf_url": f"/magazines/volume-{vol_num}.html",
        "pdf_path": f"pdf/volume-{vol_num}.html",
        "published_at": "2026-06-17",
        "is_active": True,
        "category": vol["category"]
    })

# Write SQL file to disk
sql_file_path = os.path.join(luxura_dir, "insert_new_magazines.sql")
with open(sql_file_path, "w", encoding="utf-8") as f:
    f.write("\n\n".join(sql_inserts))
    f.write("\n")

print(f"Generated SQL insert script at {sql_file_path} ({len(sql_inserts)} rows)")

# Direct Supabase insertion via REST endpoint
print("Attempting to insert/upsert data directly into Supabase...")
supabase_url = "https://rkecfnssedbsccpynwwx.supabase.co"
anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZWNmbnNzZWRic2NjcHlud3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI2ODEsImV4cCI6MjA5NTY4ODY4MX0.SFIqUf-kKs7SLX-I39ZJ1E3nYFFM9qMGnSEZQKhvmvY"

url = f"{supabase_url}/rest/v1/magazines"
headers = {
    "apikey": anon_key,
    "Authorization": f"Bearer {anon_key}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

data = json.dumps(upsert_payload).encode("utf-8")
req = urllib.request.Request(url, data=data, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        status = response.status
        print(f"Supabase REST endpoint insertion result: SUCCESS (Status: {status})")
except Exception as e:
    print(f"Supabase REST endpoint insertion result: WARNING/FAILED: {e}")
    print("If Row Level Security (RLS) is enabled, please execute the generated SQL script 'insert_new_magazines.sql' in the Supabase Dashboard SQL Editor.")
