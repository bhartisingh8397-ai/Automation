from flask import Blueprint, jsonify, request
from database import SessionLocal
from models import Client, SocialAccount

clients_bp = Blueprint('clients', __name__)

@clients_bp.route('', methods=['GET'])
def list_clients():
    session = SessionLocal()
    try:
        clients = session.query(Client).order_by(Client.id.asc()).all()
        return jsonify([c.to_dict() for c in clients])
    finally:
        session.close()

@clients_bp.route('/<int:client_id>', methods=['GET'])
def get_client(client_id):
    session = SessionLocal()
    try:
        client = session.query(Client).filter_by(id=client_id).first()
        if not client:
            return jsonify({"error": "Client not found"}), 404
        return jsonify(client.to_dict())
    finally:
        session.close()

@clients_bp.route('', methods=['POST'])
def create_client():
    session = SessionLocal()
    try:
        data = request.get_json() or {}
        name = data.get("name", "").strip()
        business_type = data.get("business_type", "General")
        social_links = data.get("social_links") or {}
        
        if not name:
            return jsonify({"error": "Client name is required"}), 400
            
        client = Client(name=name, business_type=business_type)
        session.add(client)
        session.commit()
        
        # Setup connected social accounts with custom links/handles or fallback defaults
        slug = name.lower().replace(" ", "")
        fb_handle = social_links.get("facebook", "").strip() or f"@{slug}"
        ig_handle = social_links.get("instagram", "").strip() or f"@{slug}"
        yt_handle = social_links.get("youtube", "").strip() or f"@{slug}"
        li_handle = social_links.get("linkedin", "").strip() or f"{slug}-official"
        tw_handle = social_links.get("twitter", "").strip() or f"@{slug}"

        accounts = [
            SocialAccount(client_id=client.id, platform="facebook", account_name=f"{name} Page", account_handle=fb_handle, is_connected=True),
            SocialAccount(client_id=client.id, platform="instagram", account_name=f"{name} Official", account_handle=ig_handle, is_connected=True),
            SocialAccount(client_id=client.id, platform="youtube", account_name=f"{name} Channel", account_handle=yt_handle, is_connected=True),
            SocialAccount(client_id=client.id, platform="linkedin", account_name=name, account_handle=li_handle, is_connected=True),
            SocialAccount(client_id=client.id, platform="twitter", account_name=f"{name} on X", account_handle=tw_handle, is_connected=True),
        ]
        session.add_all(accounts)
        session.commit()
        
        # Refresh client so social_accounts relationship is loaded in to_dict()
        session.refresh(client)
        return jsonify(client.to_dict()), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@clients_bp.route('/<int:client_id>/accounts/<platform>/toggle', methods=['POST'])
def toggle_account_connection(client_id, platform):
    session = SessionLocal()
    try:
        account = session.query(SocialAccount).filter_by(client_id=client_id, platform=platform.lower()).first()
        if not account:
            return jsonify({"error": "Account not found"}), 404
        account.is_connected = not account.is_connected
        session.commit()
        return jsonify(account.to_dict())
    finally:
        session.close()
