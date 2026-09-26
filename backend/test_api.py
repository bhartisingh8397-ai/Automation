import os
import sys
import json

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import init_db, SessionLocal, DB_INFO
from models import Client, Post

print("Initializing test...")
init_db()

app = create_app()
client = app.test_client()

results = {}

# 1. Health check
res = client.get('/api/health')
results['health'] = {
    'status_code': res.status_code,
    'data': res.get_json()
}

# 2. Clients check
res = client.get('/api/clients')
results['clients'] = {
    'status_code': res.status_code,
    'count': len(res.get_json()),
    'sample': res.get_json()[:2]
}

# 3. Posts check
res = client.get('/api/posts')
results['posts'] = {
    'status_code': res.status_code,
    'count': len(res.get_json()),
    'sample': res.get_json()[:2]
}

# 4. AI Generator check
res = client.post('/api/ai/generate', json={
    'topic': 'Trauma Center & Intensive Care',
    'client_name': 'Keshav Hospital',
    'business_type': 'Healthcare'
})
results['ai_generator'] = {
    'status_code': res.status_code,
    'data': res.get_json()
}

# 5. Logs check
res = client.get('/api/logs')
results['logs'] = {
    'status_code': res.status_code,
    'count': len(res.get_json())
}

out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_result.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("Test completed successfully! Saved to test_result.json")
