import os
import sys

# Ensure current directory is on python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import init_db
from services.scheduler import PostScheduler

def main():
    print("=" * 60)
    print("Digigyapan | Social Media Automation System (Python Flask)")
    print("=" * 60)
    
    # 1. Initialize Database (MySQL with SQLite automatic fallback)
    print("[1/3] Initializing Database & Schema...")
    init_db()
    
    # 2. Start Background Scheduler for Automated Post Publishing
    print("[2/3] Starting Background Post Scheduler...")
    PostScheduler.start(interval_seconds=10)
    
    # 3. Create and launch Flask Web Server
    print("[3/3] Starting Flask REST API on http://127.0.0.1:5000 ...")
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False, threaded=True)

if __name__ == "__main__":
    main()
