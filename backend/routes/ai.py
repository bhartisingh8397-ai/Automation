from flask import Blueprint, jsonify, request
from services.ai_generator import AIGenerator

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/generate', methods=['POST'])
def generate_caption():
    data = request.get_json() or {}
    topic = data.get("topic", "Hospital Blood Bank Facility")
    client_name = data.get("client_name", "Keshav Hospital")
    business_type = data.get("business_type", "Healthcare")
    
    result = AIGenerator.generate(
        topic=topic,
        client_name=client_name,
        business_type=business_type
    )
    return jsonify(result)
