import urllib.parse
from flask import Blueprint, jsonify, request, redirect
from config import Config
from services.youtube_service import YouTubeService

youtube_bp = Blueprint('youtube', __name__)

@youtube_bp.route('/status', methods=['GET'])
def get_youtube_status():
    """
    Get current YouTube API and OAuth integration status
    """
    try:
        status = YouTubeService.get_status()
        return jsonify(status)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@youtube_bp.route('/auth-url', methods=['GET'])
def get_auth_url():
    """
    Generate Google OAuth 2.0 authorization URL for connecting a YouTube Channel
    """
    redirect_uri = request.args.get('redirect_uri')
    url = YouTubeService.get_auth_url(redirect_uri)
    if not url:
        return jsonify({"error": "YouTube Client ID not configured"}), 400
    return jsonify({"auth_url": url})

@youtube_bp.route('/oauth2callback', methods=['GET'])
def oauth2callback():
    """
    Google OAuth 2.0 redirect callback endpoint
    """
    code = request.args.get('code')
    error = request.args.get('error')

    if error:
        return f"""
        <!DOCTYPE html>
        <html>
        <head><title>YouTube Connection Failed</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0b0c10; color: #fff;">
            <div style="background: #1f2833; padding: 32px; border-radius: 12px; text-align: center; max-width: 420px; border: 1px solid #ff4d4f;">
                <h2 style="color: #ff4d4f; margin-top: 0;">Authorization Cancelled</h2>
                <p style="color: #c5c6c7;">Google OAuth reported error: {error}</p>
                <button onclick="window.close()" style="background: #ff4d4f; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 15px;">Close Window</button>
            </div>
        </body>
        </html>
        """, 400

    if not code:
        return jsonify({"error": "No authorization code received"}), 400

    success, result = YouTubeService.exchange_code(code)
    if not success:
        return f"""
        <!DOCTYPE html>
        <html>
        <head><title>YouTube Token Exchange Failed</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0b0c10; color: #fff;">
            <div style="background: #1f2833; padding: 32px; border-radius: 12px; text-align: center; max-width: 420px; border: 1px solid #ff4d4f;">
                <h2 style="color: #ff4d4f; margin-top: 0;">Failed to Connect Channel</h2>
                <p style="color: #c5c6c7;">{result}</p>
                <button onclick="window.close()" style="background: #ff4d4f; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 15px;">Close Window</button>
            </div>
        </body>
        </html>
        """, 500

    channel_name = result.get("channel", {}).get("title", "YouTube Channel")

    # Render a smooth completion page that communicates with parent window if opened in popup
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>YouTube Connected Successfully</title>
        <script>
            if (window.opener) {{
                window.opener.postMessage({{ type: 'YOUTUBE_CONNECTED', channel: '{channel_name}' }}, '*');
                setTimeout(() => window.close(), 2500);
            }} else {{
                setTimeout(() => window.location.href = 'http://localhost:3000/?youtube_connected=true', 2000);
            }}
        </script>
    </head>
    <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #090a0f; color: #ffffff;">
        <div style="background: #141721; padding: 36px; border-radius: 16px; text-align: center; max-width: 440px; border: 1px solid #22c55e; box-shadow: 0 10px 40px rgba(34, 197, 94, 0.2);">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(34, 197, 94, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #22c55e; font-size: 28px;">
                ✓
            </div>
            <h2 style="color: #ffffff; margin: 0 0 8px 0; font-size: 22px;">YouTube Connected!</h2>
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">
                Channel <strong>{channel_name}</strong> is now securely authorized for automated video publishing via YouTube Data API v3.
            </p>
            <div style="font-size: 12px; color: #64748b;">
                Closing this window and returning to Digigyapan Automation Studio...
            </div>
        </div>
    </body>
    </html>
    """

@youtube_bp.route('/test', methods=['POST'])
def test_connection():
    """
    Test live YouTube Data API credentials
    """
    status = YouTubeService.get_status(check_live=True)
    return jsonify({
        "success": status.get("api_key_valid", False) or status.get("authenticated", False),
        "details": status
    })


@youtube_bp.route('/disconnect', methods=['POST'])
def disconnect():
    """
    Disconnect YouTube channel and clear OAuth tokens
    """
    success = YouTubeService.clear_tokens()
    return jsonify({"success": success, "message": "YouTube channel disconnected"})
