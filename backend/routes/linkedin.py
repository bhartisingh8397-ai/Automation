import urllib.parse
from flask import Blueprint, jsonify, request, redirect
from config import Config
from services.linkedin_service import LinkedInService

linkedin_bp = Blueprint('linkedin', __name__)

@linkedin_bp.route('/status', methods=['GET'])
def get_linkedin_status():
    """
    Get current LinkedIn API and OAuth integration status
    """
    try:
        check_live = request.args.get('check_live', 'false').lower() == 'true'
        status = LinkedInService.get_status(check_live=check_live)
        return jsonify(status)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@linkedin_bp.route('/auth-url', methods=['GET'])
def get_auth_url():
    """
    Generate LinkedIn OAuth 2.0 authorization URL for connecting a Member account or Company page
    """
    redirect_uri = request.args.get('redirect_uri')
    url = LinkedInService.get_auth_url(redirect_uri)
    if not url:
        return jsonify({"error": "LinkedIn Client ID not configured in .env"}), 400
    return jsonify({"auth_url": url})

@linkedin_bp.route('/oauth2callback', methods=['GET'])
def oauth2callback():
    """
    LinkedIn OAuth 2.0 redirect callback endpoint
    """
    code = request.args.get('code')
    error = request.args.get('error')
    error_description = request.args.get('error_description')

    if error:
        return f"""
        <!DOCTYPE html>
        <html>
        <head><title>LinkedIn Connection Cancelled</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0b0c10; color: #fff;">
            <div style="background: #1f2833; padding: 32px; border-radius: 12px; text-align: center; max-width: 420px; border: 1px solid #ff4d4f;">
                <h2 style="color: #ff4d4f; margin-top: 0;">Authorization Cancelled</h2>
                <p style="color: #c5c6c7;">LinkedIn reported error: {error_description or error}</p>
                <button onclick="window.close()" style="background: #ff4d4f; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 15px;">Close Window</button>
            </div>
        </body>
        </html>
        """, 400

    if not code:
        return jsonify({"error": "No authorization code received"}), 400

    success, result = LinkedInService.exchange_code(code)
    if not success:
        return f"""
        <!DOCTYPE html>
        <html>
        <head><title>LinkedIn Token Exchange Failed</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0b0c10; color: #fff;">
            <div style="background: #1f2833; padding: 32px; border-radius: 12px; text-align: center; max-width: 420px; border: 1px solid #ff4d4f;">
                <h2 style="color: #ff4d4f; margin-top: 0;">Failed to Connect LinkedIn</h2>
                <p style="color: #c5c6c7;">{result}</p>
                <button onclick="window.close()" style="background: #ff4d4f; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 15px;">Close Window</button>
            </div>
        </body>
        </html>
        """, 500

    author_name = result.get("author", {}).get("name", "LinkedIn Member")

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>LinkedIn Connected</title>
        <script>
            if (window.opener) {{
                window.opener.postMessage({{
                    type: 'LINKEDIN_CONNECTED',
                    author: '{author_name}'
                }}, '*');
                setTimeout(() => window.close(), 2500);
            }} else {{
                setTimeout(() => window.location.href = 'http://localhost:3000/?linkedin_connected=true', 2000);
            }}
        </script>
    </head>
    <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #090a0f; color: #ffffff;">
        <div style="background: #141721; padding: 36px; border-radius: 16px; text-align: center; max-width: 440px; border: 1px solid #0a66c2; box-shadow: 0 10px 40px rgba(10, 102, 194, 0.25);">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(10, 102, 194, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #0a66c2; font-size: 28px;">
                ✓
            </div>
            <h2 style="color: #ffffff; margin: 0 0 8px 0; font-size: 22px;">LinkedIn Connected!</h2>
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">
                Authorized as <strong>{author_name}</strong>.<br/>
                LinkedIn Share and UGC Post API is now enabled for automated multi-platform publishing.
            </p>
            <div style="font-size: 12px; color: #64748b;">
                Closing this window and returning to Digigyapan Automation Studio...
            </div>
        </div>
    </body>
    </html>
    """

@linkedin_bp.route('/test', methods=['POST'])
def test_connection():
    """
    Test live LinkedIn credentials
    """
    status = LinkedInService.get_status(check_live=True)
    return jsonify({
        "success": status.get("credentials_valid", False),
        "details": status
    })

@linkedin_bp.route('/disconnect', methods=['POST'])
def disconnect():
    """
    Disconnect LinkedIn account and clear saved tokens
    """
    success = LinkedInService.clear_tokens()
    return jsonify({"success": success, "message": "LinkedIn account disconnected"})
