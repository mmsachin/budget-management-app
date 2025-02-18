# backend/api/cost_center_api.py
from flask import Blueprint, request, jsonify
from services.cost_center_service import CostCenterService

cost_center_bp = Blueprint('cost_centers', __name__, url_prefix='/costcenters')

@cost_center_bp.route('/', methods=['GET'])
def get_cost_centers():
    try:
        cost_centers = CostCenterService.get_all_cost_centers()
        return jsonify(cost_centers)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cost_center_bp.route('/<cost_center_code>', methods=['GET'])
def get_cost_center(cost_center_code):
    try:
        cost_center = CostCenterService.get_cost_center_by_code(cost_center_code)
        if cost_center:
            return jsonify(cost_center)
        return jsonify({'message': 'Cost center not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cost_center_bp.route('/', methods=['POST'])
def create_cost_center():
    try:
        cost_center_data = request.get_json()
        cost_center_code = CostCenterService.create_cost_center(cost_center_data)
        return jsonify({'cost_center_code': cost_center_code}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cost_center_bp.route('/<cost_center_code>', methods=['PUT'])
def update_cost_center(cost_center_code):
    try:
        cost_center_data = request.get_json()
        success = CostCenterService.update_cost_center(cost_center_code, cost_center_data)
        if success:
            return jsonify({'message': 'Cost center updated successfully'})
        return jsonify({'message': 'Cost center not found'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cost_center_bp.route('/<cost_center_code>', methods=['DELETE'])
def delete_cost_center(cost_center_code):
    try:
        success = CostCenterService.delete_cost_center(cost_center_code)
        if success:
            return jsonify({'message': 'Cost center deleted successfully'}), 204
        return jsonify({'message': 'Cost center not found'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500