import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "digiauto-secret-key-2026-secure")
    
    # Upload configuration
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", str(BASE_DIR / "uploads"))
    MAX_CONTENT_LENGTH = 250 * 1024 * 1024  # 250 MB
    ALLOWED_EXTENSIONS = {"mp4", "mov", "avi", "mkv", "webm", "png", "jpg", "jpeg"}
    
    # MySQL Database Configuration
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "root")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "digiauto_db")
    
    # Fallback SQLite path
    SQLITE_PATH = BASE_DIR / "digiauto.db"
    
    # Construct database URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # YouTube Data API v3 & Google OAuth Credentials
    YOUTUBE_CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID", "")
    YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET", "")
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
    YOUTUBE_REDIRECT_URI = os.getenv("YOUTUBE_REDIRECT_URI", "http://localhost:5000/api/youtube/oauth2callback")
    YOUTUBE_TOKEN_FILE = BASE_DIR / "youtube_tokens.json"

    # Meta (Facebook & Instagram) Graph API Credentials
    META_APP_ID = os.getenv("META_APP_ID", "")
    META_APP_SECRET = os.getenv("META_APP_SECRET", "")
    META_REDIRECT_URI = os.getenv("META_REDIRECT_URI", "http://localhost:5000/api/meta/oauth2callback")
    META_ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN", "")
    META_TOKEN_FILE = BASE_DIR / "meta_tokens.json"

    # LinkedIn Developer API & OAuth Credentials
    LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID", "")
    LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET", "")
    LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:5000/api/linkedin/oauth2callback")
    LINKEDIN_TOKEN_FILE = BASE_DIR / "linkedin_tokens.json"

    # OpenAI / Open API Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "") or os.getenv("OPEN_API_KEY", "")
    
    @classmethod
    def get_mysql_uri(cls):
        # PyMySQL connection string
        pwd = f":{cls.MYSQL_PASSWORD}" if cls.MYSQL_PASSWORD else ""
        return f"mysql+pymysql://{cls.MYSQL_USER}{pwd}@{cls.MYSQL_HOST}:{cls.MYSQL_PORT}/{cls.MYSQL_DATABASE}?charset=utf8mb4"

    @classmethod
    def get_sqlite_uri(cls):
        return f"sqlite:///{cls.SQLITE_PATH}"
