# backend/app.py
from flask import Flask, jsonify
from api.budget_api import budget_bp
from api.aop_api import aop_bp
from api.user_api import user_bp
from api.cost_center_api import cost_center_bp
from api.purchase_order_api import purchase_order_bp
from api.org_hierarchy_api import org_hierarchy_bp
from flask_cors import CORS
import os  # Import the os module

app = Flask(__name__)

# Configure CORS for production - VERY IMPORTANT
CORS(app, resources={
    r"/*": {
        "origins": ["https://your-firebase-app-url.web.app"],  # Replace with your Firebase URL
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

app.register_blueprint(budget_bp)
app.register_blueprint(aop_bp)
app.register_blueprint(cost_center_bp)
app.register_blueprint(purchase_order_bp)
app.register_blueprint(user_bp)
app.register_blueprint(org_hierarchy_bp)

@app.route('/')
def hello_world():
    return jsonify({'message': 'Hello from Sachin!'})

if __name__ == '__main__':
    # Use the PORT environment variable provided by Cloud Run, or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)  # IMPORTANT: Use 0.0.0.0 for Cloud Run