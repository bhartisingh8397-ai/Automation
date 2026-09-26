from flask import Blueprint, jsonify, request
from database import DB_INFO

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "online",
        "app_name": "Digigyapan Social Media Automation",
        "database": DB_INFO,
        "team_user": {
            "name": "Digigyapan Admin",
            "email": "team@digigyapan.com",
            "role": "Super Admin",
            "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=Digigyapan"
        }
    })

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get("email", "team@digigyapan.com")
    password = data.get("password", "")
    
    # Simple simulated auth for demo dashboard
    return jsonify({
        "success": True,
        "token": "dgyp_jwt_token_882947192",
        "user": {
            "name": "Digigyapan Team",
            "email": email,
            "role": "Admin"
        }
    })
