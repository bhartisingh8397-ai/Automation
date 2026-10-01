import os
import pymysql
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, scoped_session
from config import Config
from models import Base, Client, SocialAccount, Post, PostPlatform, AutomationLog
from datetime import datetime, timedelta

# Global Session & Engine
engine = None
_SessionFactory = sessionmaker(autocommit=False, autoflush=False)
_scoped_session = scoped_session(_SessionFactory)

def SessionLocal():
    global engine, _scoped_session
    if engine is None:
        init_db()
    return _scoped_session()

DB_INFO = {
    "engine": "unknown",
    "connected": False,
    "database": Config.MYSQL_DATABASE,
    "host": Config.MYSQL_HOST,
    "port": Config.MYSQL_PORT,
    "user": Config.MYSQL_USER,
    "fallback_to_sqlite": False,
    "message": ""
}

def init_db():
    global engine, SessionLocal, DB_INFO
    
    # 1. Try MySQL Connection
    try:
        # First ensure the database exists in MySQL
        conn = pymysql.connect(
            host=Config.MYSQL_HOST,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            port=Config.MYSQL_PORT,
            charset='utf8mb4',
            connect_timeout=2
        )
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{Config.MYSQL_DATABASE}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        conn.close()
        
        # Now connect SQLAlchemy to the MySQL database
        mysql_url = Config.get_mysql_uri()
        mysql_engine = create_engine(mysql_url, pool_recycle=3600, pool_pre_ping=True)
        # Test connection
        with mysql_engine.connect() as test_conn:
            test_conn.execute(text("SELECT 1"))
        
        engine = mysql_engine
        DB_INFO.update({
            "engine": "mysql",
            "connected": True,
            "fallback_to_sqlite": False,
            "message": f"Connected to MySQL 8.0 (`{Config.MYSQL_DATABASE}`) at {Config.MYSQL_HOST}:{Config.MYSQL_PORT}"
        })
        print(f"[Database] Successfully connected to MySQL: {DB_INFO['message']}")
    except Exception as e:
        print(f"[Database] MySQL connection failed ({str(e)}). Falling back to SQLite local database.")
        sqlite_url = Config.get_sqlite_uri()
        engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
        DB_INFO.update({
            "engine": "sqlite",
            "connected": True,
            "fallback_to_sqlite": True,
            "message": f"Using SQLite fallback ({Config.SQLITE_PATH.name}) - MySQL auth failed or not configured: {str(e)}"
        })

    _SessionFactory.configure(bind=engine)
    _scoped_session.remove()
    
    # Create all tables if not exist
    Base.metadata.create_all(bind=engine)
    
    # Ensure caption_twitter and media_type columns exist in posts table for existing DBs
    try:
        with engine.connect() as col_conn:
            if DB_INFO["engine"] == "sqlite":
                pragma = col_conn.execute(text("PRAGMA table_info(posts)")).fetchall()
                col_names = [p[1] for p in pragma]
                if "caption_twitter" not in col_names:
                    col_conn.execute(text("ALTER TABLE posts ADD COLUMN caption_twitter TEXT"))
                    col_conn.commit()
                if "media_type" not in col_names:
                    col_conn.execute(text("ALTER TABLE posts ADD COLUMN media_type VARCHAR(50) DEFAULT 'video'"))
                    col_conn.commit()
            else:
                col_conn.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS caption_twitter TEXT NULL"))
                col_conn.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_type VARCHAR(50) DEFAULT 'video'"))
                col_conn.commit()
    except Exception as col_err:
        print(f"[Database] Column check notice: {col_err}")

    # Seed default data if clients table is empty
    seed_data_if_needed()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_data_if_needed():
    session = SessionLocal()
    try:
        client_count = session.query(Client).count()
        if client_count == 0:
            print("[Database] Seeding initial clients, accounts, and sample posts...")
            
            # Clients
            keshav = Client(name="Keshav Hospital", business_type="Healthcare & Multi-speciality Hospital")
            roshni = Client(name="Roshni Dental", business_type="Dental Clinic & Orthodontics")
            noble = Client(name="Noble Hospital", business_type="General Hospital & Diagnostics")
            dermatrixx = Client(name="Dermatrixx", business_type="Skin & Hair Aesthetic Clinic")
            
            session.add_all([keshav, roshni, noble, dermatrixx])
            session.commit()
            
            # Social Accounts for Keshav Hospital
            keshav_accounts = [
                SocialAccount(client_id=keshav.id, platform="facebook", account_name="Keshav Hospital", account_handle="@keshavhospital", page_id="fb_page_10982348", is_connected=True),
                SocialAccount(client_id=keshav.id, platform="instagram", account_name="Keshav Hospital", account_handle="@keshav_hospital", page_id="ig_act_904328", is_connected=True),
                SocialAccount(client_id=keshav.id, platform="youtube", account_name="Keshav Hospital Official", account_handle="@keshavhospital", page_id="yt_ch_872346", is_connected=True),
                SocialAccount(client_id=keshav.id, platform="linkedin", account_name="Keshav Hospital", account_handle="keshav-hospital-official", page_id="li_org_389247", is_connected=True),
            ]
            
            # Social Accounts for Roshni Dental
            roshni_accounts = [
                SocialAccount(client_id=roshni.id, platform="facebook", account_name="Roshni Dental Clinic", account_handle="@roshnidental", page_id="fb_page_20982341", is_connected=True),
                SocialAccount(client_id=roshni.id, platform="instagram", account_name="Roshni Dental", account_handle="@roshnidental_care", page_id="ig_act_204329", is_connected=True),
                SocialAccount(client_id=roshni.id, platform="youtube", account_name="Roshni Dental", account_handle="@roshnidental", page_id="yt_ch_272341", is_connected=True),
                SocialAccount(client_id=roshni.id, platform="linkedin", account_name="Roshni Dental Care", account_handle="roshni-dental", page_id="li_org_289241", is_connected=True),
            ]

            # Social Accounts for Noble Hospital
            noble_accounts = [
                SocialAccount(client_id=noble.id, platform="facebook", account_name="Noble Hospital", account_handle="@noblehospital", page_id="fb_page_30982341", is_connected=True),
                SocialAccount(client_id=noble.id, platform="instagram", account_name="Noble Hospital", account_handle="@noble_hospital", page_id="ig_act_304329", is_connected=True),
                SocialAccount(client_id=noble.id, platform="youtube", account_name="Noble Hospital Healthcare", account_handle="@noblehospital", page_id="yt_ch_372341", is_connected=True),
                SocialAccount(client_id=noble.id, platform="linkedin", account_name="Noble Hospital", account_handle="noble-hospital", page_id="li_org_389241", is_connected=True),
            ]

            # Social Accounts for Dermatrixx
            dermatrixx_accounts = [
                SocialAccount(client_id=dermatrixx.id, platform="facebook", account_name="Dermatrixx Skin Clinic", account_handle="@dermatrixx", page_id="fb_page_40982341", is_connected=True),
                SocialAccount(client_id=dermatrixx.id, platform="instagram", account_name="Dermatrixx", account_handle="@dermatrixx_skin", page_id="ig_act_404329", is_connected=True),
                SocialAccount(client_id=dermatrixx.id, platform="youtube", account_name="Dermatrixx Clinic", account_handle="@dermatrixx", page_id="yt_ch_472341", is_connected=True),
                SocialAccount(client_id=dermatrixx.id, platform="linkedin", account_name="Dermatrixx Aesthetics", account_handle="dermatrixx-clinic", page_id="li_org_489241", is_connected=True),
            ]
            
            session.add_all(keshav_accounts + roshni_accounts + noble_accounts + dermatrixx_accounts)
            session.commit()
            
            # Sample Posts matching the diagram
            now = datetime.utcnow()
            
            # Post 1: blood-bank.mp4 (Published)
            post1 = Post(
                client_id=keshav.id,
                video_filename="blood-bank.mp4",
                video_url="/api/posts/media/sample-blood-bank.mp4",
                file_size_mb=85.00,
                duration_str="2:15",
                caption_general="खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है...",
                caption_instagram="खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है। #BloodBank #KeshavHospital #Healthcare",
                caption_facebook="खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है...",
                caption_youtube="खरखौदा में ब्लड बैंक की सुविधा | Keshav Hospital Kharkhoda 24x7 Blood Bank Facility",
                caption_linkedin="Keshav Hospital is proud to announce expanded 24x7 advanced blood banking facilities in Kharkhoda, ensuring rapid response emergency care.",
                youtube_title="खरखौदा में ब्लड बैंक की सुविधा | Keshav Hospital",
                hashtags="#BloodBank #KeshavHospital #HealthCare #Kharkhoda #EmergencyCare",
                schedule_type="later",
                scheduled_at=now - timedelta(days=1),
                timezone="Asia/Kolkata (IST)",
                overall_status="Published"
            )
            session.add(post1)
            session.commit()
            
            session.add_all([
                PostPlatform(post_id=post1.id, platform="instagram", post_type="Reel", status="Published", platform_post_id="reel_ig_9812401", platform_post_url="https://www.instagram.com/keshav_hospital/", published_at=now - timedelta(days=1)),
                PostPlatform(post_id=post1.id, platform="facebook", post_type="Video/Reel", status="Published", platform_post_id="fb_vid_5419827", platform_post_url="https://www.facebook.com/keshavhospital", published_at=now - timedelta(days=1)),
                PostPlatform(post_id=post1.id, platform="youtube", post_type="Video", status="Published", platform_post_id="yt_vid_wJINj8w85JA", platform_post_url="https://www.youtube.com/@bhartisingh-e9h/videos", published_at=now - timedelta(days=1)),
                PostPlatform(post_id=post1.id, platform="linkedin", post_type="Video", status="Published", platform_post_id="li_urn_891724", platform_post_url="https://www.linkedin.com/company/keshav-hospital-official", published_at=now - timedelta(days=1)),
            ])
            
            # Post 2: dental-care.mp4 (Scheduled)
            post2 = Post(
                client_id=roshni.id,
                video_filename="dental-care.mp4",
                video_url="/api/posts/media/sample-dental-care.mp4",
                file_size_mb=42.50,
                duration_str="1:40",
                caption_general="अपनी मुस्कान को दें नया निखार! Roshni Dental Clinic में आधुनिक लेजर दांत सफाई और रूट कैनाल ट्रीटमेंट उपलब्ध है।",
                caption_instagram="अपनी मुस्कान को दें नया निखार! Roshni Dental Clinic में आधुनिक लेजर दांत सफाई। #DentalCare #SmileMakeover",
                caption_facebook="अपनी मुस्कान को दें नया निखार! Roshni Dental Clinic में आधुनिक लेजर दांत सफाई और रूट कैनाल ट्रीटमेंट उपलब्ध है।",
                caption_youtube="आधुनिक लेजर दांत सफाई | Complete Dental Care by Roshni Dental Clinic",
                caption_linkedin="Delivering premier cosmetic dentistry and painless root canal treatments at Roshni Dental Clinic.",
                youtube_title="आधुनिक लेजर दांत सफाई | Roshni Dental Clinic",
                hashtags="#DentalCare #SmileCare #Dentist #OralHealth",
                schedule_type="later",
                scheduled_at=now + timedelta(hours=4),
                timezone="Asia/Kolkata (IST)",
                overall_status="Scheduled"
            )
            session.add(post2)
            session.commit()
            
            session.add_all([
                PostPlatform(post_id=post2.id, platform="instagram", post_type="Reel", status="Pending", platform_post_url="https://www.instagram.com/roshnidental_care/"),
                PostPlatform(post_id=post2.id, platform="facebook", post_type="Video/Reel", status="Pending", platform_post_url="https://www.facebook.com/roshnidental"),
                PostPlatform(post_id=post2.id, platform="youtube", post_type="Video", status="Pending", platform_post_url="https://www.youtube.com/@bhartisingh-e9h/videos"),
                PostPlatform(post_id=post2.id, platform="linkedin", post_type="Video", status="Pending", platform_post_url="https://www.linkedin.com/company/roshni-dental"),
            ])

            # Post 3: diabetes.mp4 (Partially Failed)
            post3 = Post(
                client_id=noble.id,
                video_filename="diabetes.mp4",
                video_url="/api/posts/media/sample-diabetes.mp4",
                file_size_mb=68.20,
                duration_str="1:20",
                caption_general="डायबिटीज को करें नियंत्रित! Noble Hospital के विशेषज्ञ डॉक्टरों की सलाह और नियमित चेकअप से स्वस्थ रहें।",
                caption_instagram="डायबिटीज को करें नियंत्रित! Noble Hospital के विशेषज्ञ डॉक्टरों की सलाह। #DiabetesAwareness",
                caption_facebook="डायबिटीज को करें नियंत्रित! Noble Hospital के विशेषज्ञ डॉक्टरों की सलाह और नियमित चेकअप से स्वस्थ रहें।",
                caption_youtube="मधुमेह प्रबंधन और आहार सलाह | Noble Hospital Diabetes Care",
                caption_linkedin="Noble Hospital launches holistic metabolic health and diabetes management program.",
                youtube_title="मधुमेह प्रबंधन और आहार सलाह | Noble Hospital",
                hashtags="#DiabetesCare #HealthTips #NobleHospital #Wellness",
                schedule_type="later",
                scheduled_at=now - timedelta(days=2),
                timezone="Asia/Kolkata (IST)",
                overall_status="Partially Failed"
            )
            session.add(post3)
            session.commit()
            
            session.add_all([
                PostPlatform(post_id=post3.id, platform="instagram", post_type="Reel", status="Published", platform_post_id="reel_ig_498210", platform_post_url="https://www.instagram.com/noble_hospital/", published_at=now - timedelta(days=2)),
                PostPlatform(post_id=post3.id, platform="facebook", post_type="Video/Reel", status="Published", platform_post_id="fb_vid_891024", platform_post_url="https://www.facebook.com/noblehospital", published_at=now - timedelta(days=2)),
                PostPlatform(post_id=post3.id, platform="youtube", post_type="Video", status="Failed", error_message="Daily upload quota exceeded for YouTube Data API v3. Retry available.", platform_post_url="https://www.youtube.com/@bhartisingh-e9h/videos"),
                PostPlatform(post_id=post3.id, platform="linkedin", post_type="Video", status="Published", platform_post_id="li_urn_728910", platform_post_url="https://www.linkedin.com/company/noble-hospital", published_at=now - timedelta(days=2)),
            ])

            # Post 4: hair-care.mp4 (Failed)
            post4 = Post(
                client_id=dermatrixx.id,
                video_filename="hair-care.mp4",
                video_url="/api/posts/media/sample-hair-care.mp4",
                file_size_mb=55.40,
                duration_str="1:10",
                caption_general="बालों के झड़ने से परेशान? Dermatrixx Clinic में एडवांस PRP और हेयर रीग्रोथ थेरेपी से पाएं घने बाल।",
                caption_instagram="बालों के झड़ने से परेशान? Dermatrixx Clinic में एडवांस PRP और हेयर रीग्रोथ थेरेपी। #HairCare #PRPTreatment",
                caption_facebook="बालों के झड़ने से परेशान? Dermatrixx Clinic में एडवांस PRP और हेयर रीग्रोथ थेरेपी से पाएं घने बाल।",
                caption_youtube="एडवांस हेयर रीग्रोथ थेरेपी और PRP | Dermatrixx Clinic",
                caption_linkedin="Cutting-edge hair restoration and regenerative PRP therapies now available at Dermatrixx Clinic.",
                youtube_title="एडवांस हेयर रीग्रोथ थेरेपी | Dermatrixx Clinic",
                hashtags="#HairRestoration #PRPTreatment #Dermatrixx #Aesthetics",
                schedule_type="later",
                scheduled_at=now - timedelta(days=3),
                timezone="Asia/Kolkata (IST)",
                overall_status="Failed"
            )
            session.add(post4)
            session.commit()
            
            session.add_all([
                PostPlatform(post_id=post4.id, platform="instagram", post_type="Reel", status="Failed", error_message="Video aspect ratio (4:3) invalid for Instagram Reels. 9:16 required."),
                PostPlatform(post_id=post4.id, platform="facebook", post_type="Video/Reel", status="Failed", error_message="Facebook Page access token expired. Please re-authenticate."),
                PostPlatform(post_id=post4.id, platform="youtube", post_type="Video", status="Failed", error_message="Channel verification required for video longer than 15 mins."),
                PostPlatform(post_id=post4.id, platform="linkedin", post_type="Video", status="Failed", error_message="OAuth token renewal required."),
            ])

            # Automation step logs for post 1
            session.add_all([
                AutomationLog(post_id=post1.id, step_number=1, step_name="Webhook Trigger", status="success", message="Received post payload for Keshav Hospital (blood-bank.mp4)"),
                AutomationLog(post_id=post1.id, step_number=2, step_name="Save to Database", status="success", message="Post record saved to MySQL (digiauto_db.posts)"),
                AutomationLog(post_id=post1.id, step_number=3, step_name="Wait Until Scheduled Time", status="success", message="Scheduled trigger hit at 25 Sep 2026 07:30 PM IST"),
                AutomationLog(post_id=post1.id, step_number=4, step_name="Get Video & Details", status="success", message="Fetched blood-bank.mp4 (85 MB) and platform-tailored captions"),
                AutomationLog(post_id=post1.id, step_number=5, step_name="Publish to Selected Platforms", status="success", message="Dispatched to Instagram Reels, Facebook Video, YouTube, and LinkedIn"),
                AutomationLog(post_id=post1.id, step_number=6, step_name="Get Response", status="success", message="Received 200 OK from all 4 social media platform APIs"),
                AutomationLog(post_id=post1.id, step_number=7, step_name="Update Status in Database", status="success", message="Updated overall_status to 'Published' in MySQL"),
                AutomationLog(post_id=post1.id, step_number=8, step_name="Show Result in Dashboard", status="success", message="Post synchronized to Digigyapan dashboard")
            ])
            session.commit()
            print("[Database] Initial seeding completed successfully.")
    except Exception as e:
        session.rollback()
        print(f"[Database] Seeding error: {e}")
    finally:
        session.close()
