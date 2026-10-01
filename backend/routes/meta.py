import urllib.parse
from flask import Blueprint, jsonify, request, redirect
from config import Config
from services.meta_service import MetaService

meta_bp = Blueprint('meta', __name__)

@meta_bp.route('/status', methods=['GET'])
def get_meta_status():
    """
    Get current Meta (Facebook & Instagram) API and OAuth integration status
    """
    try:
        check_live = request.args.get('check_live', 'false').lower() == 'true'
        status = MetaService.get_status(check_live=check_live)
        return jsonify(status)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@meta_bp.route('/auth-url', methods=['GET'])
def get_auth_url():
    """
    Generate Meta OAuth 2.0 authorization URL for connecting Facebook Pages and Instagram Accounts
    """
    redirect_uri = request.args.get('redirect_uri')
    url = MetaService.get_auth_url(redirect_uri)
    if not url:
        return jsonify({"error": "Meta App ID not configured in .env"}), 400
    return jsonify({"auth_url": url})

@meta_bp.route('/oauth2callback', methods=['GET'])
def oauth2callback():
    """
    Meta OAuth 2.0 redirect callback endpoint
    """
    code = request.args.get('code')
    error = request.args.get('error')
    error_reason = request.args.get('error_reason')

    if error:
        return f"""
        <!DOCTYPE html>
        <html>
        <head><title>Meta Connection Cancelled</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0b0c10; color: #fff;">
            <div style="background: #1f2833; padding: 32px; border-radius: 12px; text-align: center; max-width: 420px; border: 1px solid #ff4d4f;">
                <h2 style="color: #ff4d4f; margin-top: 0;">Authorization Cancelled</h2>
                <p style="color: #c5c6c7;">Meta reported error: {error_reason or error}</p>
                <button onclick="window.close()" style="background: #ff4d4f; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 15px;">Close Window</button>
            </div>
        </body>
        </html>
        """, 400

    if not code:
        return jsonify({"error": "No authorization code received"}), 400

    success, result = MetaService.exchange_code(code)
    if not success:
        return f"""
        <!DOCTYPE html>
        <html>
        <head><title>Meta Token Exchange Failed</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0b0c10; color: #fff;">
            <div style="background: #1f2833; padding: 32px; border-radius: 12px; text-align: center; max-width: 420px; border: 1px solid #ff4d4f;">
                <h2 style="color: #ff4d4f; margin-top: 0;">Failed to Connect Meta Account</h2>
                <p style="color: #c5c6c7;">{result}</p>
                <button onclick="window.close()" style="background: #ff4d4f; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 15px;">Close Window</button>
            </div>
        </body>
        </html>
        """, 500

    pages = result.get("pages", [])
    ig_accounts = result.get("instagram_accounts", [])
    user_name = result.get("user", {}).get("name", "Meta Account")
    page_count = len(pages)
    ig_count = len(ig_accounts)

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Meta (Facebook & Instagram) Connected</title>
        <script>
            if (window.opener) {{
                window.opener.postMessage({{
                    type: 'META_CONNECTED',
                    user: '{user_name}',
                    pages: {page_count},
                    instagram_accounts: {ig_count}
                }}, '*');
                setTimeout(() => window.close(), 2500);
            }} else {{
                setTimeout(() => window.location.href = 'http://localhost:3000/?meta_connected=true', 2000);
            }}
        </script>
    </head>
    <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #090a0f; color: #ffffff;">
        <div style="background: #141721; padding: 36px; border-radius: 16px; text-align: center; max-width: 440px; border: 1px solid #1877f2; box-shadow: 0 10px 40px rgba(24, 119, 242, 0.25);">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(24, 119, 242, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #1877f2; font-size: 28px;">
                ✓
            </div>
            <h2 style="color: #ffffff; margin: 0 0 8px 0; font-size: 22px;">Meta Accounts Connected!</h2>
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">
                Authorized as <strong>{user_name}</strong>.<br/>
                Found <strong>{page_count} Facebook Pages</strong> and <strong>{ig_count} Instagram Professional Accounts</strong> ready for automated posting.
            </p>
            <div style="font-size: 12px; color: #64748b;">
                Closing this window and returning to Digigyapan Automation Studio...
            </div>
        </div>
    </body>
    </html>
    """

@meta_bp.route('/test', methods=['POST'])
def test_connection():
    """
    Test live Meta App credentials against Graph API
    """
    status = MetaService.get_status(check_live=True)
    return jsonify({
        "success": status.get("app_valid", False),
        "details": status
    })

@meta_bp.route('/disconnect', methods=['POST'])
def disconnect():
    """
    Disconnect Meta account and clear saved tokens
    """
    success = MetaService.clear_tokens()
    return jsonify({"success": success, "message": "Meta accounts disconnected"})
