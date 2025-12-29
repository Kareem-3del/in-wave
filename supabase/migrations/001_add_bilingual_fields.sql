-- Migration: Add bilingual support (English/Arabic) to all content tables
-- Run this in Supabase SQL Editor after the initial schema

-- ============================================
-- PROJECTS TABLE - Add bilingual fields
-- ============================================
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS title_italic_en TEXT,
  ADD COLUMN IF NOT EXISTS title_italic_ar TEXT,
  ADD COLUMN IF NOT EXISTS title_regular_en TEXT,
  ADD COLUMN IF NOT EXISTS title_regular_ar TEXT,
  ADD COLUMN IF NOT EXISTS location_en TEXT,
  ADD COLUMN IF NOT EXISTS location_ar TEXT;

-- Migrate existing data to English fields
UPDATE projects SET
  title_italic_en = title_italic,
  title_regular_en = title_regular,
  location_en = location
WHERE title_italic_en IS NULL;

-- ============================================
-- TESTIMONIALS TABLE - Add bilingual fields
-- ============================================
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS text_en TEXT,
  ADD COLUMN IF NOT EXISTS text_ar TEXT;

-- Migrate existing data to English fields
UPDATE testimonials SET
  name_en = name,
  text_en = text
WHERE name_en IS NULL;

-- ============================================
-- HERO SLIDES TABLE - Add bilingual fields
-- ============================================
ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS alt_text_en TEXT,
  ADD COLUMN IF NOT EXISTS alt_text_ar TEXT;

-- Migrate existing data to English fields
UPDATE hero_slides SET
  alt_text_en = alt_text
WHERE alt_text_en IS NULL;

-- ============================================
-- OFFICES TABLE - Add bilingual fields
-- ============================================
ALTER TABLE offices
  ADD COLUMN IF NOT EXISTS city_en TEXT,
  ADD COLUMN IF NOT EXISTS city_ar TEXT,
  ADD COLUMN IF NOT EXISTS country_en TEXT,
  ADD COLUMN IF NOT EXISTS country_ar TEXT;

-- Migrate existing data to English fields
UPDATE offices SET
  city_en = city,
  country_en = country
WHERE city_en IS NULL;

-- ============================================
-- SERVICES TABLE - Add bilingual fields
-- ============================================
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS name_ar TEXT;

-- Migrate existing data to English fields
UPDATE services SET
  name_en = name
WHERE name_en IS NULL;

-- ============================================
-- WORK STAGES TABLE - Add bilingual fields
-- ============================================
ALTER TABLE work_stages
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_ar TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- Migrate existing data to English fields
UPDATE work_stages SET
  title_en = title,
  description_en = description
WHERE title_en IS NULL;

-- ============================================
-- TEAM INFO TABLE - Add bilingual fields
-- ============================================
ALTER TABLE team_info
  ADD COLUMN IF NOT EXISTS title_lines_en TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS title_lines_ar TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_paragraphs_en TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_paragraphs_ar TEXT[] DEFAULT '{}';

-- Migrate existing data to English fields
UPDATE team_info SET
  title_lines_en = title_lines,
  description_paragraphs_en = description_paragraphs
WHERE title_lines_en = '{}' OR title_lines_en IS NULL;

-- ============================================
-- SOCIAL LINKS TABLE - Add bilingual fields (platform name)
-- ============================================
ALTER TABLE social_links
  ADD COLUMN IF NOT EXISTS platform_en TEXT,
  ADD COLUMN IF NOT EXISTS platform_ar TEXT;

-- Migrate existing data to English fields
UPDATE social_links SET
  platform_en = platform
WHERE platform_en IS NULL;

-- ============================================
-- SITE SETTINGS - No changes needed (uses JSONB which can store both languages)
-- ============================================

-- Add comments to document the bilingual fields
COMMENT ON COLUMN projects.title_italic_en IS 'English title (italic part)';
COMMENT ON COLUMN projects.title_italic_ar IS 'Arabic title (italic part)';
COMMENT ON COLUMN projects.title_regular_en IS 'English title (regular part)';
COMMENT ON COLUMN projects.title_regular_ar IS 'Arabic title (regular part)';
COMMENT ON COLUMN projects.location_en IS 'English location';
COMMENT ON COLUMN projects.location_ar IS 'Arabic location';

COMMENT ON COLUMN testimonials.name_en IS 'English customer name';
COMMENT ON COLUMN testimonials.name_ar IS 'Arabic customer name';
COMMENT ON COLUMN testimonials.text_en IS 'English review text';
COMMENT ON COLUMN testimonials.text_ar IS 'Arabic review text';

COMMENT ON COLUMN offices.city_en IS 'English city name';
COMMENT ON COLUMN offices.city_ar IS 'Arabic city name';
COMMENT ON COLUMN offices.country_en IS 'English country name';
COMMENT ON COLUMN offices.country_ar IS 'Arabic country name';

COMMENT ON COLUMN services.name_en IS 'English service name';
COMMENT ON COLUMN services.name_ar IS 'Arabic service name';

COMMENT ON COLUMN work_stages.title_en IS 'English stage title';
COMMENT ON COLUMN work_stages.title_ar IS 'Arabic stage title';
COMMENT ON COLUMN work_stages.description_en IS 'English stage description';
COMMENT ON COLUMN work_stages.description_ar IS 'Arabic stage description';
