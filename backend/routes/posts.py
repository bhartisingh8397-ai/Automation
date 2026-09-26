import os
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from flask import Blueprint, jsonify, request, send_from_directory, current_app
from database import SessionLocal
from models import Post, PostPlatform, AutomationLog, Client
from services.publisher import PlatformPublisher
from config import Config

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('', methods=['GET'])
def list_posts():
    session = SessionLocal()
    try:
        posts = session.query(Post).order_by(Post.created_at.desc()).all()
        return jsonify([p.to_dict() for p in posts])
    finally:
        session.close()

@posts_bp.route('/<int:post_id>', methods=['GET'])
def get_post(post_id):
    session = SessionLocal()
    try:
        post = session.query(Post).filter_by(id=post_id).first()
        if not post:
            return jsonify({"error": "Post not found"}), 404
        return jsonify(post.to_dict())
    finally:
        session.close()

@posts_bp.route('/upload', methods=['POST'])
def upload_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    if not filename:
        filename = f"video_{int(datetime.utcnow().timestamp())}.mp4"

    upload_folder = Config.UPLOAD_FOLDER
    os.makedirs(upload_folder, exist_ok=True)
    save_path = os.path.join(upload_folder, filename)
    file.save(save_path)
    
    file_size_bytes = os.path.getsize(save_path)
    file_size_mb = round(file_size_bytes / (1024 * 1024), 2)
    
    # Detect photo vs video
    media_type = "photo" if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif')) else "video"
    default_dur = "Photo (1080x1080)" if media_type == "photo" else "1:30"
    duration_str = request.form.get("duration", default_dur)
    
    return jsonify({
        "success": True,
        "filename": filename,
        "media_type": media_type,
        "file_size_mb": file_size_mb,
        "duration_str": duration_str,
        "video_url": f"/api/posts/media/{filename}"
    })

@posts_bp.route('', methods=['POST'])
def create_post():
    session = SessionLocal()
    try:
        data = request.get_json() or {}
        
        client_id = data.get("client_id")
        if not client_id:
            return jsonify({"error": "Client ID is required"}), 400
            
        client = session.query(Client).filter_by(id=client_id).first()
        if not client:
            return jsonify({"error": "Client not found"}), 404
            
        video_filename = data.get("video_filename") or "blood-bank.mp4"
        video_url = data.get("video_url") or f"/api/posts/media/{video_filename}"
        file_size_mb = data.get("file_size_mb", 50.0)
        
        # Detect media type
        media_type = data.get("media_type") or ("photo" if video_filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')) else "video")
        default_dur = "Photo (1080x1080)" if media_type == "photo" else "2:00"
        duration_str = data.get("duration_str", default_dur)
        
        caption_general = data.get("caption_general", "")
        caption_instagram = data.get("caption_instagram", caption_general)
        caption_facebook = data.get("caption_facebook", caption_general)
        caption_youtube = data.get("caption_youtube", caption_general)
        caption_linkedin = data.get("caption_linkedin", caption_general)
        caption_twitter = data.get("caption_twitter", caption_general)
        youtube_title = data.get("youtube_title", "")
        hashtags = data.get("hashtags", "")
        
        schedule_type = data.get("schedule_type", "now") # 'now' or 'later'
        timezone = data.get("timezone", "Asia/Kolkata (IST)")
        
        if schedule_type == 'now':
            scheduled_at = datetime.utcnow()
            overall_status = "Processing"
        else:
            scheduled_date_str = data.get("scheduled_at")
            if scheduled_date_str:
                try:
                    scheduled_at = datetime.fromisoformat(scheduled_date_str.replace("Z", "+00:00")).replace(tzinfo=None)
                except Exception:
                    scheduled_at = datetime.utcnow() + timedelta(hours=2)
            else:
                scheduled_at = datetime.utcnow() + timedelta(hours=2)
            overall_status = "Scheduled"

        post = Post(
            client_id=client_id,
            video_filename=video_filename,
            video_url=video_url,
            file_size_mb=file_size_mb,
            duration_str=duration_str,
            media_type=media_type,
            caption_general=caption_general,
            caption_instagram=caption_instagram,
            caption_facebook=caption_facebook,
            caption_youtube=caption_youtube,
            caption_linkedin=caption_linkedin,
            caption_twitter=caption_twitter,
            youtube_title=youtube_title,
            hashtags=hashtags,
            schedule_type=schedule_type,
            scheduled_at=scheduled_at,
            timezone=timezone,
            overall_status=overall_status
        )
        session.add(post)
        session.commit()

        # Target platforms selected
        platforms_selected = data.get("platforms", ["instagram", "facebook", "youtube", "linkedin", "twitter"])
        if not platforms_selected:
            platforms_selected = ["instagram", "facebook"]

        if media_type == "photo":
            platform_types = {
                "instagram": "Photo / Carousel",
                "facebook": "Photo Post",
                "youtube": "Community Post",
                "linkedin": "Image Post",
                "twitter": "Photo Tweet"
            }
        else:
            platform_types = {
                "instagram": "Reel",
                "facebook": "Video/Reel",
                "youtube": "Video",
                "linkedin": "Video",
                "twitter": "Video Tweet"
            }

        for plat in platforms_selected:
            plat_lower = plat.lower()
            p_obj = PostPlatform(
                post_id=post.id,
                platform=plat_lower,
                post_type=platform_types.get(plat_lower, "Post"),
                status="Pending"
            )
            session.add(p_obj)
        session.commit()

        # Step 1: Webhook Trigger log
        log1 = AutomationLog(
            post_id=post.id,
            step_number=1,
            step_name="Webhook Trigger",
            status="success",
            message=f"Received post data for '{client.name}' via API endpoint"
        )
        # Step 2: Save to Database log
        log2 = AutomationLog(
            post_id=post.id,
            step_number=2,
            step_name="Save to Database",
            status="success",
            message=f"Post #{post.id} stored in database with {len(platforms_selected)} target platforms"
        )
        session.add_all([log1, log2])
        session.commit()

        # If publish now, execute immediately
        if schedule_type == 'now':
            PlatformPublisher.publish_post(post.id)
        else:
            # Step 3: Wait Until Scheduled Time
            log3 = AutomationLog(
                post_id=post.id,
                step_number=3,
                step_name="Wait Until Scheduled Time",
                status="info",
                message=f"Post queued for scheduled delivery at {scheduled_at.strftime('%d %b %Y %I:%M %p')} ({timezone})"
            )
            session.add(log3)
            session.commit()

        # Re-fetch post with updated relations
        refreshed_post = session.query(Post).filter_by(id=post.id).first()
        return jsonify(refreshed_post.to_dict()), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@posts_bp.route('/<int:post_id>/publish', methods=['POST'])
def publish_now(post_id):
    success, status = PlatformPublisher.publish_post(post_id)
    if not success:
        return jsonify({"error": status}), 400
    return jsonify({"success": True, "overall_status": status})

@posts_bp.route('/<int:post_id>/retry', methods=['POST'])
def retry_post(post_id):
    success, status = PlatformPublisher.retry_post(post_id)
    if not success:
        return jsonify({"error": status}), 400
    return jsonify({"success": True, "overall_status": status})

@posts_bp.route('/<int:post_id>/cancel', methods=['POST'])
def cancel_post(post_id):
    session = SessionLocal()
    try:
        post = session.query(Post).filter_by(id=post_id).first()
        if not post:
            return jsonify({"error": "Post not found"}), 404
        post.overall_status = "Cancelled"
        session.commit()
        return jsonify({"success": True, "post": post.to_dict()})
    finally:
        session.close()

@posts_bp.route('/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    session = SessionLocal()
    try:
        post = session.query(Post).filter_by(id=post_id).first()
        if not post:
            return jsonify({"error": "Post not found"}), 404
        session.delete(post)
        session.commit()
        return jsonify({"success": True, "message": f"Post #{post_id} deleted"})
    finally:
        session.close()

@posts_bp.route('/media/<filename>', methods=['GET'])
def get_media(filename):
    upload_folder = Config.UPLOAD_FOLDER
    os.makedirs(upload_folder, exist_ok=True)
    if os.path.exists(os.path.join(upload_folder, filename)):
        return send_from_directory(upload_folder, filename)
    return jsonify({"message": f"Sample media stream placeholder for {filename}"}), 200
