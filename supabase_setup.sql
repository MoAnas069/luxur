-- =========================================================================
-- SETUP FOR CONTACT INQUIRIES TABLE
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- =========================================================================

-- 1. Create the contact_inquiries table if it does not already exist
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy to allow anyone (anon role) to insert inquiries
-- This allows the contact form on your website to save entries directly
DROP POLICY IF EXISTS "Allow public insert" ON public.contact_inquiries;
CREATE POLICY "Allow public insert" 
ON public.contact_inquiries 
FOR INSERT 
WITH CHECK (true);

-- 4. (Optional) Create Policy to restrict reading entries to authenticated admin users only
-- Anyone with the service role key or admin dashboard access can already read this, 
-- but this prevents random public users from reading inquiries.
DROP POLICY IF EXISTS "Restrict read to authenticated only" ON public.contact_inquiries;
CREATE POLICY "Restrict read to authenticated only" 
ON public.contact_inquiries 
FOR SELECT 
TO authenticated 
USING (true);

-- 5. Add ip_address column to store submitter's IP
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- 6. Create RPC function to securely verify email uniqueness and rate limits bypassing RLS
CREATE OR REPLACE FUNCTION public.check_inquiry_exists(check_email TEXT, check_ip TEXT, check_time TIMESTAMPTZ)
RETURNS TABLE (email_exists BOOLEAN, ip_rate_limited BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with high privileges to read table data
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS(SELECT 1 FROM public.contact_inquiries WHERE email = check_email) AS email_exists,
        EXISTS(SELECT 1 FROM public.contact_inquiries WHERE ip_address = check_ip AND created_at > check_time) AS ip_rate_limited;
END;
$$;

-- Grant execution permissions to public/anonymous roles
GRANT EXECUTE ON FUNCTION public.check_inquiry_exists TO anon, authenticated;

