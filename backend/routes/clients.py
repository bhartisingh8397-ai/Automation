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
        
        # Setup connected social accounts ONLY for links that were actually provided
        accounts = []
        for plat in ["facebook", "instagram", "youtube", "linkedin"]:
            handle = (social_links.get(plat) or "").strip()
            if handle:
                accounts.append(
                    SocialAccount(
                        client_id=client.id,
                        platform=plat,
                        account_name=f"{name} {plat.capitalize()}",
                        account_handle=handle,
                        is_connected=True
                    )
                )

        if accounts:
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

@clients_bp.route('/<int:client_id>/accounts', methods=['POST', 'PUT'])
def update_client_accounts(client_id):
    """
    Add or update social media accounts for an existing client
    """
    session = SessionLocal()
    try:
        client = session.query(Client).filter_by(id=client_id).first()
        if not client:
            return jsonify({"error": "Client not found"}), 404

        data = request.get_json() or {}
        social_links = data.get("social_links") or {}

        for plat in ["facebook", "instagram", "youtube", "linkedin"]:
            if plat in social_links:
                handle = (social_links.get(plat) or "").strip()
                existing_acc = session.query(SocialAccount).filter_by(client_id=client_id, platform=plat).first()

                if handle:
                    if existing_acc:
                        existing_acc.account_handle = handle
                        existing_acc.is_connected = True
                    else:
                        new_acc = SocialAccount(
                            client_id=client.id,
                            platform=plat,
                            account_name=f"{client.name} {plat.capitalize()}",
                            account_handle=handle,
                            is_connected=True
                        )
                        session.add(new_acc)
                elif handle == "" and existing_acc:
                    # If explicitly cleared, remove account
                    session.delete(existing_acc)

        session.commit()
        session.refresh(client)
        return jsonify(client.to_dict()), 200
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@clients_bp.route('/<int:client_id>/accounts/<platform>', methods=['DELETE'])
def delete_client_account(client_id, platform):
    """
    Remove a social media account from an existing client
    """
    session = SessionLocal()
    try:
        account = session.query(SocialAccount).filter_by(client_id=client_id, platform=platform.lower()).first()
        if not account:
            return jsonify({"error": "Account not found"}), 404
        session.delete(account)
        session.commit()
        return jsonify({"success": True, "message": f"{platform} account removed"})
    finally:
        session.close()

