from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Client(Base):
    __tablename__ = 'clients'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    business_type = Column(String(100), default='General')
    logo_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    social_accounts = relationship("SocialAccount", back_populates="client", cascade="all, delete-orphan")
    posts = relationship("Post", back_populates="client", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "business_type": self.business_type,
            "logo_url": self.logo_url,
            "social_accounts": [acc.to_dict() for acc in self.social_accounts] if self.social_accounts else [],
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class SocialAccount(Base):
    __tablename__ = 'social_accounts'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(Integer, ForeignKey('clients.id', ondelete='CASCADE'), nullable=False)
    platform = Column(String(50), nullable=False) # 'instagram', 'facebook', 'youtube', 'linkedin'
    account_name = Column(String(255), nullable=False)
    account_handle = Column(String(255), nullable=True)
    page_id = Column(String(255), nullable=True)
    is_connected = Column(Boolean, default=True)
    access_token = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    client = relationship("Client", back_populates="social_accounts")
    
    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "platform": self.platform,
            "account_name": self.account_name,
            "account_handle": self.account_handle,
            "page_id": self.page_id,
            "is_connected": bool(self.is_connected),
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(Integer, ForeignKey('clients.id', ondelete='CASCADE'), nullable=False)
    video_filename = Column(String(255), nullable=False)
    video_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500), nullable=True)
    file_size_mb = Column(Numeric(8, 2), default=0.0)
    duration_str = Column(String(50), default='0:00')
    media_type = Column(String(50), default='video') # 'video' or 'photo'
    caption_general = Column(Text, nullable=True)
    caption_instagram = Column(Text, nullable=True)
    caption_facebook = Column(Text, nullable=True)
    caption_youtube = Column(Text, nullable=True)
    caption_linkedin = Column(Text, nullable=True)
    caption_twitter = Column(Text, nullable=True)
    youtube_title = Column(String(255), nullable=True)
    hashtags = Column(Text, nullable=True)
    schedule_type = Column(String(20), default='now') # 'now' or 'later'
    scheduled_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    timezone = Column(String(100), default='Asia/Kolkata (IST)')
    overall_status = Column(String(50), default='Scheduled') # 'Scheduled', 'Published', 'Partially Failed', 'Failed', 'Processing', 'Cancelled'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    client = relationship("Client", back_populates="posts")
    platforms = relationship("PostPlatform", back_populates="post", cascade="all, delete-orphan")
    logs = relationship("AutomationLog", back_populates="post", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "client_name": self.client.name if self.client else "Unknown Client",
            "video_filename": self.video_filename,
            "video_url": self.video_url,
            "thumbnail_url": self.thumbnail_url,
            "file_size_mb": float(self.file_size_mb) if self.file_size_mb else 0.0,
            "duration_str": self.duration_str,
            "media_type": self.media_type or ("photo" if self.video_filename and self.video_filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')) else "video"),
            "caption_general": self.caption_general,
            "caption_instagram": self.caption_instagram,
            "caption_facebook": self.caption_facebook,
            "caption_youtube": self.caption_youtube,
            "caption_linkedin": self.caption_linkedin,
            "caption_twitter": self.caption_twitter,
            "youtube_title": self.youtube_title,
            "hashtags": self.hashtags,
            "schedule_type": self.schedule_type,
            "scheduled_at": self.scheduled_at.isoformat() if self.scheduled_at else None,
            "timezone": self.timezone,
            "overall_status": self.overall_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "platforms": [p.to_dict() for p in self.platforms] if self.platforms else [],
            "client_social_accounts": [acc.to_dict() for acc in self.client.social_accounts] if (self.client and self.client.social_accounts) else []
        }

class PostPlatform(Base):
    __tablename__ = 'post_platforms'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    platform = Column(String(50), nullable=False)
    post_type = Column(String(100), default='Video')
    status = Column(String(50), default='Pending') # 'Pending', 'Published', 'Failed'
    platform_post_id = Column(String(255), nullable=True)
    platform_post_url = Column(String(500), nullable=True)
    error_message = Column(Text, nullable=True)
    published_at = Column(DateTime, nullable=True)
    
    post = relationship("Post", back_populates="platforms")
    
    def to_dict(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "platform": self.platform,
            "post_type": self.post_type,
            "status": self.status,
            "platform_post_id": self.platform_post_id,
            "platform_post_url": self.platform_post_url,
            "error_message": self.error_message,
            "published_at": self.published_at.isoformat() if self.published_at else None
        }

class AutomationLog(Base):
    __tablename__ = 'automation_logs'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), nullable=True)
    step_number = Column(Integer, nullable=False)
    step_name = Column(String(100), nullable=False)
    status = Column(String(20), default='info') # 'info', 'success', 'warning', 'error'
    message = Column(Text, nullable=False)
    payload_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    post = relationship("Post", back_populates="logs")
    
    def to_dict(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "step_number": self.step_number,
            "step_name": self.step_name,
            "status": self.status,
            "message": self.message,
            "created_at": self.created_at.strftime("%H:%M:%S") if self.created_at else None
        }
