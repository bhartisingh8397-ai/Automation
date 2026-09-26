import threading
import time
from datetime import datetime
from database import SessionLocal
from models import Post
from services.publisher import PlatformPublisher

class PostScheduler:
    """
    Background worker that checks for scheduled posts due to be published.
    """
    _running = False
    _thread = None

    @classmethod
    def start(cls, interval_seconds=10):
        if cls._running:
            return
        cls._running = True
        cls._thread = threading.Thread(target=cls._run_loop, args=(interval_seconds,), daemon=True)
        cls._thread.start()
        print(f"[Scheduler] Post scheduler started (Polling every {interval_seconds}s)")

    @classmethod
    def stop(cls):
        cls._running = False
        print("[Scheduler] Post scheduler stopped")

    @classmethod
    def _run_loop(cls, interval_seconds):
        while cls._running:
            try:
                cls.check_and_publish_due_posts()
            except Exception as e:
                print(f"[Scheduler Error] {e}")
            time.sleep(interval_seconds)

    @classmethod
    def check_and_publish_due_posts(cls):
        session = SessionLocal()
        try:
            now = datetime.utcnow()
            due_posts = session.query(Post).filter(
                Post.overall_status == "Scheduled",
                Post.scheduled_at <= now
            ).all()

            for post in due_posts:
                print(f"[Scheduler] Due post found! Triggering publishing for Post #{post.id} ({post.video_filename})")
                PlatformPublisher.publish_post(post.id)
        except Exception as e:
            print(f"[Scheduler Poll Error] {e}")
        finally:
            session.close()
