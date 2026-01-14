-- Add image_url column to testimonials table
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN testimonials.image_url IS 'URL of the customer photo';
