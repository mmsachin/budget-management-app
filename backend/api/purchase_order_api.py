# backend/api/purchase_order_api.py
from flask import Blueprint, jsonify
from services import purchase_order_service

purchase_order_bp = Blueprint('purchase_orders', __name__, url_prefix='/purchase-orders')

@purchase_order_bp.route('/', methods=['GET'])
def get_purchase_orders():
    try:
        purchase_orders = purchase_order_service.get_all_purchase_orders()
        return jsonify(purchase_orders), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@purchase_order_bp.route('/<po_id>', methods=['GET'])
def get_purchase_order(po_id):
    try:
        purchase_order = purchase_order_service.get_purchase_order_by_id(po_id)
        if purchase_order:
            return jsonify(purchase_order), 200
        return jsonify({'message': 'Purchase order not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@purchase_order_bp.route('/user/<ldap>', methods=['GET'])
def get_user_purchase_orders(ldap):
    try:
        purchase_orders = purchase_order_service.get_purchase_orders_by_ldap(ldap)
        return jsonify(purchase_orders), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500