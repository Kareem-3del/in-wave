-- IN-WAVE Architects Seed Data
-- Run this after schema.sql to populate initial data

-- Projects (Gallery items)
INSERT INTO projects (type, images, title_italic, title_regular, location, year, href, show_marquee, display_order, is_active) VALUES
(1, ARRAY['/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-7-655x1024.jpg.webp', '/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-13-1688x1080-1-1024x655.webp'], 'ZENITH', 'GROVE', 'INDIA', '2025', '/portfolio/zenith-grove', true, 0, true),
(2, ARRAY['/images/img_2256-1024x573.jpg.webp'], 'NOIR', 'NEST', 'USA', '2025', '/portfolio/noir-nest', false, 1, true),
(1, ARRAY['/images/1-22-764x1080-1-724x1024.webp', '/images/30-1-1920x1075-1-1024x573.webp'], 'VILLA', 'CASCADE', 'UAE', '2024', '/portfolio/villa-cascade', true, 2, true),
(2, ARRAY['/images/img_9119-1024x640.jpg.webp'], 'EXQUISITE', 'RESIDENCE', 'UAE', '2023', '/portfolio/exquisite-residence', false, 3, true),
(3, ARRAY['/images/living__view09-kopiya-573x1024.jpg.webp', '/images/living___view290000-kopiya-1024x573.jpg.webp'], 'TRANQUIL', 'LUX', 'USA', '2024', '/portfolio/tranquil-lux', false, 4, true),
(1, ARRAY['/images/nk_view190001_post-1-573x1024.jpg.webp', '/images/img_6310-1024x573.jpg.webp'], 'ARCHITECTURAL', 'ELEGANCE', 'UAE', '2024', '/portfolio/architectural-elegance', true, 5, true),
(2, ARRAY['/images/acacia_11-2-1024x573.jpg.webp'], 'LUXURY', 'LIVING', 'PHILIPPINES', '2024', '/portfolio/luxury-living', false, 6, true),
(3, ARRAY['/images/thureya-new_main-zone_view20-573x1024.jpg.webp', '/images/thureya-new_main-zone_view310000-1024x573.jpg.webp'], 'NOIR', 'HORIZON', 'UAE', '2024', '/portfolio/noir-horizon', false, 7, true);

-- Testimonials
INSERT INTO testimonials (name, rating, text, display_order, is_active) VALUES
('John', 5, 'The studio''s systematic approach and exceptional organization exceeded my expectations. They were attentive to every detail, ensuring nothing was overlooked. The final result was even better than I imagined, and I couldn''t be happier!', 0, true),
('Ahmed', 5, 'This team knows how to make things happen! Their organizational skills and methodical approach ensured a smooth process, and their ability to focus on the smallest details brought our project to life in the most incredible way. Highly efficient and creative professionals!', 1, true),
('Esam', 5, 'I was blown away by the level of professionalism and efficiency of the studio. The entire process was stress free, and their ability to balance creativity with a structured approach truly sets them apart. Highly recommended!', 2, true),
('Aisha', 5, 'The studio''s procurement process is flawless. Every piece, from furniture to finishes, was carefully sourced and delivered without a hitch. Their professionalism and efficiency saved us time and eliminated unnecessary stress. A fantastic experience!', 3, true),
('Ahmed', 5, 'Designing our villa was a massive undertaking, but this studio made it an enjoyable journey. From the grand entryway to the cozy bedrooms, every detail was carefully thought out. Our family particularly loves the outdoor terrace with its breathtaking views—it''s where we spend most evenings now. Thank you for turning our dream home into a reality!', 4, true),
('Nico', 5, 'We''ve partnered with many design firms over the years, but this studio stands out for their strategic and creative approach. Their designs brought our project to life, combining modern luxury with thoughtful functionality. The villas have received glowing reviews from clients, and we''re already planning to collaborate on our next development.', 5, true);

-- Hero Slides
INSERT INTO hero_slides (image_url, alt_text, display_order, is_active) VALUES
('/images/sl-home1.jpg', 'Hero slide 1', 0, true),
('/images/img_8442-1920x1080.jpg', 'Hero slide 2', 1, true),
('/images/img_9119-1728x1080.jpg', 'Hero slide 3', 2, true),
('/images/img_0249-1920x1075.jpg', 'Hero slide 4', 3, true),
('/images/villa_greece_1-3-1-2-1920x1075.jpg', 'Hero slide 5', 4, true),
('/images/img_8473-1-1920x1080.jpg', 'Hero slide 6', 5, true),
('/images/local_mr_obaid_dubai_2243_entrance_main_hall_family_dining_v1_28-7-1920x1075.jpg', 'Hero slide 7', 6, true),
('/images/img_1493-1-1-scaled-2-1920x960.jpg', 'Hero slide 8', 7, true),
('/images/img_9824-1920x1075.jpg', 'Hero slide 9', 8, true);

-- Offices
INSERT INTO offices (city, country, phone, phone_href, email, email_href, display_order, is_active) VALUES
('Dubai', 'UAE', '+971 5018 77644', 'tel:+971501877644', 'office@in-wavearchitects.com', 'mailto:office@in-wavearchitects.com', 0, true),
('Los Angeles', 'USA', '+1 954 271-5832', 'tel:+19542715832', NULL, NULL, 1, true),
('Kyiv', 'Ukraine', '+380 98 080 77 07', 'tel:+380980807707', NULL, NULL, 2, true),
('Montreal', 'Canada', '+1 4384053284', 'tel:+14384053284', NULL, NULL, 3, true);

-- Services
INSERT INTO services (name, display_order, is_active) VALUES
('Interior design', 0, true),
('Architectural design', 1, true),
('Author''s supervision', 2, true),
('Equipment', 3, true),
('Renovation', 4, true),
('Realization', 5, true);

-- Work Stages
INSERT INTO work_stages (stage_number, title, description, display_order, is_active) VALUES
('01', 'Start', 'We start by studying your project, taking all needed measurements and choosing style for it.', 0, true),
('02', 'Plan', 'Then, we process a point-by-point plan and present several examples for you.', 1, true),
('03', 'Visualization', 'At this stage we create detailed visualization for each room to provide you with an overall picture.', 2, true),
('04', 'Album', 'The design project album with all plans and visualizations is ready.', 3, true);

-- Team Info
INSERT INTO team_info (title_lines, description_paragraphs, image_url, years_experience, projects_count, countries_count) VALUES
(
  ARRAY['10 years experience', 'in combination with a', 'perfect taste'],
  ARRAY['Founded in 2016, IN-WAVE Architects has grown into a leading design studio specializing in luxury residential and commercial interiors. Our team combines years of experience with a passion for creating spaces that inspire.', 'With over 90 projects completed across 10 countries, we bring a global perspective to every design while respecting local traditions and preferences.'],
  '/images/team-photo.jpg',
  10,
  90,
  10
);

-- Social Links
INSERT INTO social_links (platform, icon_url, href, display_order, is_active) VALUES
('Facebook', '/icons/facebook-ic.svg', 'https://www.facebook.com/IN-WAVE.Architecture.and.Design', 0, true),
('Instagram', '/icons/instagram-ic.svg', 'https://www.instagram.com/in-wave.architects/', 1, true),
('Pinterest', '/icons/pinterest-ic.svg', 'https://www.pinterest.com/nk__interior__', 2, true),
('Behance', '/icons/behance-logo0-1.svg', 'https://www.behance.net/4ebd134f', 3, true),
('TikTok', '/icons/logo-tiktok.svg', 'https://www.tiktok.com/@nk_interior_', 4, true),
('LinkedIn', '/icons/linkedin-circle-1.svg', 'https://www.linkedin.com/company/106635723', 5, true);
