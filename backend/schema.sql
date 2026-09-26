-- ====================================================================
-- Digigyapan | Social Media Automation System
-- Database Schema for MySQL 8.0+
-- Database: digiauto_db
-- ====================================================================

CREATE DATABASE IF NOT EXISTS digiauto_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE digiauto_db;

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) DEFAULT 'General',
    logo_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Social Accounts Connected to Clients
CREATE TABLE IF NOT EXISTS social_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    platform ENUM('instagram', 'facebook', 'youtube', 'linkedin', 'twitter') NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_handle VARCHAR(255) NULL,
    page_id VARCHAR(255) NULL,
    is_connected BOOLEAN DEFAULT TRUE,
    access_token TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    UNIQUE KEY uq_client_platform (client_id, platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Scheduled / Published Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    video_filename VARCHAR(255) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500) NULL,
    file_size_mb DECIMAL(8, 2) DEFAULT 0.00,
    duration_str VARCHAR(50) DEFAULT '0:00',
    caption_general TEXT NULL,
    caption_instagram TEXT NULL,
    caption_facebook TEXT NULL,
    caption_youtube TEXT NULL,
    caption_linkedin TEXT NULL,
    caption_twitter TEXT NULL,
    youtube_title VARCHAR(255) NULL,
    hashtags TEXT NULL,
    schedule_type ENUM('now', 'later') DEFAULT 'now',
    scheduled_at DATETIME NOT NULL,
    timezone VARCHAR(100) DEFAULT 'Asia/Kolkata (IST)',
    overall_status ENUM('Scheduled', 'Published', 'Partially Failed', 'Failed', 'Processing', 'Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Post Platform Delivery Details
CREATE TABLE IF NOT EXISTS post_platforms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    platform ENUM('instagram', 'facebook', 'youtube', 'linkedin', 'twitter') NOT NULL,
    post_type VARCHAR(100) DEFAULT 'Video', -- e.g. 'Reel', 'Video', 'Post'
    status ENUM('Pending', 'Published', 'Failed') DEFAULT 'Pending',
    platform_post_id VARCHAR(255) NULL,
    platform_post_url VARCHAR(500) NULL,
    error_message TEXT NULL,
    published_at DATETIME NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE KEY uq_post_platform (post_id, platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Automation Event Logs (Step 1 to 8 in backend flow)
CREATE TABLE IF NOT EXISTS automation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NULL,
    step_number INT NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    status ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    message TEXT NOT NULL,
    payload_json JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED INITIAL SAMPLE DATA MATCHING USER FLOW
-- ====================================================================

-- Clients
INSERT INTO clients (id, name, business_type) VALUES
(1, 'Keshav Hospital', 'Healthcare & Multi-speciality Hospital'),
(2, 'Roshni Dental', 'Dental Clinic & Orthodontics'),
(3, 'Noble Hospital', 'General Hospital & Diagnostics'),
(4, 'Dermatrixx', 'Skin & Hair Aesthetic Clinic')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Social Accounts for Keshav Hospital
INSERT INTO social_accounts (client_id, platform, account_name, account_handle, page_id, is_connected) VALUES
(1, 'facebook', 'Keshav Hospital', '@keshavhospital', 'fb_page_10982348', TRUE),
(1, 'instagram', 'Keshav Hospital', '@keshav_hospital', 'ig_act_904328', TRUE),
(1, 'youtube', 'Keshav Hospital Official', '@keshavhospital', 'yt_ch_872346', TRUE),
(1, 'linkedin', 'Keshav Hospital', 'keshav-hospital-official', 'li_org_389247', TRUE),

(2, 'facebook', 'Roshni Dental Clinic', '@roshnidental', 'fb_page_20982341', TRUE),
(2, 'instagram', 'Roshni Dental', '@roshnidental_care', 'ig_act_204329', TRUE),
(2, 'youtube', 'Roshni Dental', '@roshnidental', 'yt_ch_272341', TRUE),
(2, 'linkedin', 'Roshni Dental Care', 'roshni-dental', 'li_org_289241', TRUE),

(3, 'facebook', 'Noble Hospital', '@noblehospital', 'fb_page_30982341', TRUE),
(3, 'instagram', 'Noble Hospital', '@noble_hospital', 'ig_act_304329', TRUE),
(3, 'youtube', 'Noble Hospital Healthcare', '@noblehospital', 'yt_ch_372341', TRUE),
(3, 'linkedin', 'Noble Hospital', 'noble-hospital', 'li_org_389241', TRUE),

(4, 'facebook', 'Dermatrixx Skin Clinic', '@dermatrixx', 'fb_page_40982341', TRUE),
(4, 'instagram', 'Dermatrixx', '@dermatrixx_skin', 'ig_act_404329', TRUE),
(4, 'youtube', 'Dermatrixx Clinic', '@dermatrixx', 'yt_ch_472341', TRUE),
(4, 'linkedin', 'Dermatrixx Aesthetics', 'dermatrixx-clinic', 'li_org_489241', TRUE)
ON DUPLICATE KEY UPDATE account_name=VALUES(account_name);

-- Sample Posts matching table in image
-- 1. blood-bank.mp4 (Published)
INSERT INTO posts (id, client_id, video_filename, video_url, file_size_mb, duration_str, caption_general, caption_instagram, caption_facebook, caption_youtube, caption_linkedin, youtube_title, hashtags, schedule_type, scheduled_at, timezone, overall_status) VALUES
(1, 1, 'blood-bank.mp4', '/uploads/blood-bank.mp4', 85.00, '2:15', 
'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है...',
'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है। #BloodBank #KeshavHospital #Healthcare',
'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है...',
'खरखौदा में ब्लड बैंक की सुविधा | Keshav Hospital Kharkhoda 24x7 Blood Bank Facility',
'Keshav Hospital is proud to announce expanded 24x7 advanced blood banking facilities in Kharkhoda, ensuring rapid response emergency care.',
'खरखौदा में ब्लड बैंक की सुविधा | Keshav Hospital',
'#BloodBank #KeshavHospital #HealthCare #Kharkhoda #EmergencyCare',
'later', '2026-09-25 19:30:00', 'Asia/Kolkata (IST)', 'Published'),

-- 2. dental-care.mp4 (Scheduled)
(2, 2, 'dental-care.mp4', '/uploads/dental-care.mp4', 42.50, '1:40',
'अपनी मुस्कान को दें नया निखार! Roshni Dental Clinic में आधुनिक लेजर दांत सफाई और रूट कैनाल ट्रीटमेंट उपलब्ध है।',
'अपनी मुस्कान को दें नया निखार! Roshni Dental Clinic में आधुनिक लेजर दांत सफाई। #DentalCare #SmileMakeover',
'अपनी मुस्कान को दें नया निखार! Roshni Dental Clinic में आधुनिक लेजर दांत सफाई और रूट कैनाल ट्रीटमेंट उपलब्ध है।',
'आधुनिक लेजर दांत सफाई | Complete Dental Care by Roshni Dental Clinic',
'Delivering premier cosmetic dentistry and painless root canal treatments at Roshni Dental Clinic.',
'आधुनिक लेजर दांत सफाई | Roshni Dental Clinic',
'#DentalCare #SmileCare #Dentist #OralHealth',
'later', '2026-09-26 10:00:00', 'Asia/Kolkata (IST)', 'Scheduled'),

-- 3. diabetes.mp4 (Partially Failed)
(3, 3, 'diabetes.mp4', '/uploads/diabetes.mp4', 68.20, '1:20',
'डायबिटीज को करें नियंत्रित! Noble Hospital के विशेषज्ञ डॉक्टरों की सलाह और नियमित चेकअप से स्वस्थ रहें।',
'डायबिटीज को करें नियंत्रित! Noble Hospital के विशेषज्ञ डॉक्टरों की सलाह। #DiabetesAwareness',
'डायबिटीज को करें नियंत्रित! Noble Hospital के विशेषज्ञ डॉक्टरों की सलाह और नियमित चेकअप से स्वस्थ रहें।',
'मधुमेह प्रबंधन और आहार सलाह | Noble Hospital Diabetes Care',
'Noble Hospital launches holistic metabolic health and diabetes management program.',
'मधुमेह प्रबंधन और आहार सलाह | Noble Hospital',
'#DiabetesCare #HealthTips #NobleHospital #Wellness',
'later', '2026-09-24 18:00:00', 'Asia/Kolkata (IST)', 'Partially Failed'),

-- 4. hair-care.mp4 (Failed)
(4, 4, 'hair-care.mp4', '/uploads/hair-care.mp4', 55.40, '1:10',
'बालों के झड़ने से परेशान? Dermatrixx Clinic में एडवांस PRP और हेयर रीग्रोथ थेरेपी से पाएं घने बाल।',
'बालों के झड़ने से परेशान? Dermatrixx Clinic में एडवांस PRP और हेयर रीग्रोथ थेरेपी। #HairCare #PRPTreatment',
'बालों के झड़ने से परेशान? Dermatrixx Clinic में एडवांस PRP और हेयर रीग्रोथ थेरेपी से पाएं घने बाल।',
'एडवांस हेयर रीग्रोथ थेरेपी और PRP | Dermatrixx Clinic',
'Cutting-edge hair restoration and regenerative PRP therapies now available at Dermatrixx Clinic.',
'एडवांस हेयर रीग्रोथ थेरेपी | Dermatrixx Clinic',
'#HairRestoration #PRPTreatment #Dermatrixx #Aesthetics',
'later', '2026-09-23 16:30:00', 'Asia/Kolkata (IST)', 'Failed')
ON DUPLICATE KEY UPDATE video_filename=VALUES(video_filename);

-- Post Platforms Delivery records
INSERT INTO post_platforms (post_id, platform, post_type, status, platform_post_id, platform_post_url, published_at) VALUES
(1, 'instagram', 'Reel', 'Published', 'reel_ig_9812401', 'https://instagram.com/reel/C89218xKeshav', '2026-09-25 19:30:15'),
(1, 'facebook', 'Video/Reel', 'Published', 'fb_vid_5419827', 'https://facebook.com/keshavhospital/videos/5419827', '2026-09-25 19:30:20'),
(1, 'youtube', 'Video', 'Published', 'yt_vid_K8h92_1v', 'https://youtube.com/watch?v=K8h92_1v', '2026-09-25 19:30:25'),
(1, 'linkedin', 'Video', 'Published', 'li_urn_891724', 'https://linkedin.com/feed/update/urn:li:activity:891724', '2026-09-25 19:30:30'),

(2, 'instagram', 'Reel', 'Pending', NULL, NULL, NULL),
(2, 'facebook', 'Video/Reel', 'Pending', NULL, NULL, NULL),
(2, 'youtube', 'Video', 'Pending', NULL, NULL, NULL),
(2, 'linkedin', 'Video', 'Pending', NULL, NULL, NULL),

(3, 'instagram', 'Reel', 'Published', 'reel_ig_498210', 'https://instagram.com/reel/D91834xNoble', '2026-09-24 18:00:15'),
(3, 'facebook', 'Video/Reel', 'Published', 'fb_vid_891024', 'https://facebook.com/noblehospital/videos/891024', '2026-09-24 18:00:22'),
(3, 'youtube', 'Video', 'Failed', NULL, NULL, NULL),
(3, 'linkedin', 'Video', 'Published', 'li_urn_728910', 'https://linkedin.com/feed/update/urn:li:activity:728910', '2026-09-24 18:00:35'),

(4, 'instagram', 'Reel', 'Failed', NULL, NULL, NULL),
(4, 'facebook', 'Video/Reel', 'Failed', NULL, NULL, NULL),
(4, 'youtube', 'Video', 'Failed', NULL, NULL, NULL),
(4, 'linkedin', 'Video', 'Failed', NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE status=VALUES(status);
