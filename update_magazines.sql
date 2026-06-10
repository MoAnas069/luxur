ALTER TABLE magazines ADD COLUMN IF NOT EXISTS category text;

UPDATE magazines SET category = 'Living', cover_url = '/images/mag_cover_d46bc29b-f6ed-47c2-b28e-6d86f40bc8e3.jpg' WHERE id = 'd46bc29b-f6ed-47c2-b28e-6d86f40bc8e3';
UPDATE magazines SET category = 'Bed', cover_url = 'https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/magazines/covers/1780156916516-cover-volume2.webp' WHERE id = 'ac6d841c-2890-483c-b752-7b5f7d533c57';
UPDATE magazines SET category = 'Dining', cover_url = '/images/mag_cover_871c85fa-49db-4541-a38a-c0cd47c7fbf3.jpg' WHERE id = '871c85fa-49db-4541-a38a-c0cd47c7fbf3';
UPDATE magazines SET category = 'Lighting', cover_url = '/images/mag_cover_6267de12-c5de-4ec6-b3f1-c38f61ef3753.webp' WHERE id = '6267de12-c5de-4ec6-b3f1-c38f61ef3753';
UPDATE magazines SET category = 'Lighting', cover_url = 'https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/magazines/covers/1780157037438-cover-volume5.webp' WHERE id = 'd367645e-8331-4e0b-869d-54b6d47b9870';
UPDATE magazines SET category = 'Dining', cover_url = '/images/mag_cover_86e56d66-e604-4992-ae4b-224255347759.jpg' WHERE id = '86e56d66-e604-4992-ae4b-224255347759';
UPDATE magazines SET category = 'Living', cover_url = '/images/mag_cover_6e7085d2-1bf7-4ffb-a618-6d34aebfc2dd.png' WHERE id = '6e7085d2-1bf7-4ffb-a618-6d34aebfc2dd';
UPDATE magazines SET category = 'Lighting', cover_url = '/images/mag_cover_cd5021c1-1cf8-4c38-84cb-8b44fe56e831.webp' WHERE id = 'cd5021c1-1cf8-4c38-84cb-8b44fe56e831';
UPDATE magazines SET category = 'Living', cover_url = 'https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/magazines/covers/1780171615337-cover-volume7.webp' WHERE id = '7a1e4bee-b4c8-4d45-903b-da8fd48fdb43';
