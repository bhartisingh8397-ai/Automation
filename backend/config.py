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
    
    @classmethod
    def get_mysql_uri(cls):
        # PyMySQL connection string
        pwd = f":{cls.MYSQL_PASSWORD}" if cls.MYSQL_PASSWORD else ""
        return f"mysql+pymysql://{cls.MYSQL_USER}{pwd}@{cls.MYSQL_HOST}:{cls.MYSQL_PORT}/{cls.MYSQL_DATABASE}?charset=utf8mb4"

    @classmethod
    def get_sqlite_uri(cls):
        return f"sqlite:///{cls.SQLITE_PATH}"
