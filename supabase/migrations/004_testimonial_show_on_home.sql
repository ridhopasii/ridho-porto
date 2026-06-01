-- Kontrol tampil/sembunyi testimoni di beranda.
-- Default true agar testimoni yang sudah ada tetap tampil.
ALTER TABLE public."Testimonial"
  ADD COLUMN IF NOT EXISTS "showOnHome" boolean NOT NULL DEFAULT true;
