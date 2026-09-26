from flask import Blueprint, jsonify
from database import SessionLocal
from models import AutomationLog, Post

logs_bp = Blueprint('logs', __name__)

@logs_bp.route('', methods=['GET'])
def get_logs():
    session = SessionLocal()
    try:
        logs = session.query(AutomationLog).order_by(AutomationLog.created_at.desc()).limit(50).all()
        return jsonify([log.to_dict() for log in logs])
    finally:
        session.close()

@logs_bp.route('/post/<int:post_id>', methods=['GET'])
def get_post_logs(post_id):
    session = SessionLocal()
    try:
        logs = session.query(AutomationLog).filter_by(post_id=post_id).order_by(AutomationLog.step_number.asc()).all()
        return jsonify([log.to_dict() for log in logs])
    finally:
        session.close()
