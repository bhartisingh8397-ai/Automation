import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from database import DB_INFO
from routes.auth import auth_bp
from routes.clients import clients_bp
from routes.posts import posts_bp
from routes.ai import ai_bp
from routes.logs import logs_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes (Next.js frontend runs on localhost:3000)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Ensure uploads directory exists
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(logs_bp, url_prefix='/api/logs')

    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            "status": "healthy",
            "service": "Digigyapan Social Media Automation API",
            "database": DB_INFO
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

    return app

if __name__ == '__main__':
    from database import init_db
    from services.scheduler import PostScheduler
    
    init_db()
    PostScheduler.start(interval_seconds=10)
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
