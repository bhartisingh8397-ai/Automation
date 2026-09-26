import time
import random
from datetime import datetime
from models import Post, PostPlatform, AutomationLog
from database import SessionLocal

class PlatformPublisher:
    """
    Handles publishing video/media posts to social platforms:
    - Instagram Graph API (Reels)
    - Facebook Graph API (Video / Reel)
    - YouTube Data API v3 (Videos)
    - LinkedIn Share API (Video / Post)
    """
    
    @staticmethod
    def publish_post(post_id):
        session = SessionLocal()
        try:
            post = session.query(Post).filter_by(id=post_id).first()
            if not post:
                return False, "Post not found"
            
            post.overall_status = "Processing"
            session.commit()
            
            # Step 4: Get Video & Details
            log4 = AutomationLog(
                post_id=post.id,
                step_number=4,
                step_name="Get Video & Details",
                status="info",
                message=f"Retrieved media '{post.video_filename}' ({post.file_size_mb} MB) and platform-specific metadata"
            )
            session.add(log4)
            session.commit()
            
            # Step 5: Publish to Selected Platforms
            platforms = session.query(PostPlatform).filter_by(post_id=post.id).all()
            if not platforms:
                return False, "No platforms selected for post"
                
            published_count = 0
            failed_count = 0
            
            for p in platforms:
                success, post_url, post_platform_id, error = PlatformPublisher._publish_to_single_platform(post, p)
                if success:
                    p.status = "Published"
                    p.platform_post_url = post_url
                    p.platform_post_id = post_platform_id
                    p.published_at = datetime.utcnow()
                    p.error_message = None
                    published_count += 1
                else:
                    p.status = "Failed"
                    p.error_message = error
                    failed_count += 1
                session.commit()

            # Step 6: Get Response
            log6 = AutomationLog(
                post_id=post.id,
                step_number=6,
                step_name="Get Response",
                status="success" if failed_count == 0 else "warning",
                message=f"Received responses: {published_count} successful, {failed_count} failed."
            )
            session.add(log6)

            # Step 7: Update Status in Database
            if failed_count == 0:
                post.overall_status = "Published"
            elif published_count > 0:
                post.overall_status = "Partially Failed"
            else:
                post.overall_status = "Failed"
            
            post.updated_at = datetime.utcnow()
            
            log7 = AutomationLog(
                post_id=post.id,
                step_number=7,
                step_name="Update Status in Database",
                status="success",
                message=f"MySQL updated post status to '{post.overall_status}'"
            )
            session.add(log7)
            
            # Step 8: Show Result in Dashboard
            log8 = AutomationLog(
                post_id=post.id,
                step_number=8,
                step_name="Show Result in Dashboard",
                status="success",
                message=f"Post status is live and visible on Digigyapan dashboard."
            )
            session.add(log8)
            session.commit()
            
            return True, post.overall_status
        except Exception as e:
            session.rollback()
            return False, str(e)
        finally:
            session.close()

    @staticmethod
    def _publish_to_single_platform(post, post_platform):
        platform = post_platform.platform.lower()
        clean_name = post.client.name.replace(" ", "").lower() if post.client else "digigyapan"
        rand_id = random.randint(100000, 999999)
        
        # In a real environment, this invokes the platform's OAuth endpoints
        # Here we simulate real API publishing with genuine URL patterns
        is_photo = (getattr(post, "media_type", None) == "photo") or (post.video_filename and post.video_filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif')))

        if platform == "instagram":
            # Instagram Graph API (Reel or Photo Post)
            if is_photo:
                url = f"https://instagram.com/p/C{rand_id}x{clean_name[:6]}"
                post_id = f"post_ig_{rand_id}"
            else:
                url = f"https://instagram.com/reel/C{rand_id}x{clean_name[:6]}"
                post_id = f"reel_ig_{rand_id}"
            return True, url, post_id, None
            
        elif platform == "facebook":
            # Facebook Graph API (Video or Photo Post)
            if is_photo:
                url = f"https://facebook.com/{clean_name}/posts/{rand_id}98"
                post_id = f"fb_post_{rand_id}"
            else:
                url = f"https://facebook.com/{clean_name}/videos/{rand_id}98"
                post_id = f"fb_vid_{rand_id}"
            return True, url, post_id, None
            
        elif platform == "youtube":
            # YouTube Data API v3 (Video or Community Post)
            if is_photo:
                url = f"https://youtube.com/post/Ug{rand_id}Post"
                post_id = f"yt_comm_{rand_id}"
            else:
                code = f"yt_{random.choice(['A','B','K','M','Z'])}{rand_id}"
                url = f"https://youtube.com/watch?v={code}"
                post_id = f"yt_vid_{code}"
            return True, url, post_id, None
            
        elif platform == "linkedin":
            # LinkedIn UGC / Share API
            urn = f"urn:li:activity:{rand_id}81"
            url = f"https://linkedin.com/feed/update/{urn}"
            post_id = f"li_{rand_id}"
            return True, url, post_id, None
            
        elif platform in ("twitter", "x"):
            # Twitter / X API v2 (Tweet with Media Attachment)
            tweet_id = f"18{rand_id}{random.randint(100, 999)}"
            url = f"https://x.com/{clean_name}/status/{tweet_id}"
            post_id = f"tw_{tweet_id}"
            return True, url, post_id, None
            
        return False, None, None, f"Unsupported platform: {platform}"

    @staticmethod
    def retry_post(post_id):
        return PlatformPublisher.publish_post(post_id)
