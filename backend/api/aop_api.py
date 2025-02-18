# backend/api/aop_api.py
from flask import Blueprint, request, jsonify
from services import aop_service
from services import cost_center_service

aop_bp = Blueprint('aop', __name__, url_prefix='/aop')

# --- AOP Header Endpoints ---

@aop_bp.route('/headers', methods=['POST'])
def create_aop_header():
    try:
        aop_data = request.get_json()
        if not aop_data or 'aop_name' not in aop_data or 'total_amount' not in aop_data:
            return jsonify({'error': 'Invalid AOP Header data. aop_name and total_amount are required.'}), 400

        try:
            aop_data['total_amount'] = float(aop_data['total_amount'])
        except ValueError:
            return jsonify({'error': 'total_amount must be a number'}), 400

        aop_id = aop_service.create_aop_header(aop_data)
        return jsonify({'aop_id': aop_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aop_bp.route('/headers', methods=['GET'])
def get_aop_headers():
    try:
        headers = aop_service.get_all_aop_headers()
        return jsonify(headers), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aop_bp.route('/headers/<aop_id>', methods=['GET'])
def get_aop_header(aop_id):
    try:
        header = aop_service.get_aop_header_by_id(aop_id)
        if header:
            return jsonify(header), 200
        else:
            return jsonify({'message': 'AOP Header not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aop_bp.route('/headers/<aop_id>', methods=['PUT'])
def update_aop_header(aop_id):
    try:
        aop_data = request.get_json()

        if not aop_data or 'aop_name' not in aop_data or 'total_amount' not in aop_data or 'status' not in aop_data :
            return jsonify({'error': 'Invalid AOP Header data. aop_name, total_amount and status are required.'}), 400

        try:
            aop_data['total_amount'] = float(aop_data['total_amount'])
        except ValueError:
            return jsonify({'error': 'total_amount must be a number'}), 400

        if aop_service.update_aop_header(aop_id, aop_data):
            return jsonify({'message': 'AOP Header updated successfully'}), 200
        else:
            return jsonify({'message': 'AOP Header not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aop_bp.route('/headers/<aop_id>/status', methods=['PUT'])
def set_aop_header_status(aop_id):
    try:
        data = request.get_json()
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        status = data['status']
        if status.lower() not in ['draft', 'active', 'eol']:
            return jsonify({'error': 'Invalid status value'}), 400

        if status.lower() == "active":
            aop_header = aop_service.get_aop_header_by_id(aop_id)
            if not aop_header:
                return jsonify({'message': 'AOP Header not found'}), 404

            total_detail_amount = aop_service.get_total_aop_detail_amount(aop_id)

            if total_detail_amount > aop_header["total_amount"]:
                return jsonify({'error': 'Total AOP Detail amount exceeds AOP Header total amount'}), 400

        aop_service.set_aop_status(aop_id, status)
        return jsonify({'message': f'AOP status set to {status}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aop_bp.route('/headers/<aop_id>', methods=['DELETE'])
def delete_aop_header(aop_id):
    try:
        if aop_service.delete_aop_header(aop_id):
            return jsonify({'message': 'AOP Header deleted successfully'}), 204
        else:
            return jsonify({'message': 'AOP Header not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# --- AOP Detail Endpoints ---

@aop_bp.route('/details', methods=['POST'])
def create_aop_detail():
    try:
        aop_detail_data = request.get_json()
        required_fields = ['aop_id', 'cost_center_code', 'amount']
        if not aop_detail_data or any(field not in aop_detail_data for field in required_fields):
            return jsonify({'error': 'Invalid AOP Detail data. aop_id, cost_center_code and amount are required.'}), 400

        try:
            aop_detail_data['amount'] = float(aop_detail_data['amount'])
        except ValueError:
            return jsonify({'error': 'amount must be a number'}), 400

        cost_center = cost_center_service.get_cost_center_by_code(aop_detail_data['cost_center_code'])
        if not cost_center:
             return jsonify({'error': 'Invalid cost_center_code. Cost Center does not exist.'}), 400

        aop_detail_id = aop_service.create_aop_detail(aop_detail_data)
        return jsonify({'aop_detail_id': aop_detail_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aop_bp.route('/details/<aop_detail_id>', methods=['GET'])
def get_aop_detail(aop_detail_id):
    try:
        detail = aop_service.get_aop_detail_by_id(aop_detail_id)
        if detail:
            return jsonify(detail), 200
        else:
            return jsonify({'message': 'AOP Detail not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aop_bp.route('/details/by-aop/<aop_id>', methods=['GET'])
def get_aop_details_for_aop(aop_id):
    try:
        details = aop_service.get_aop_details_by_aop_id(aop_id)
        return jsonify(details), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500

@aop_bp.route('/details/<aop_detail_id>', methods=['PUT'])
def update_aop_detail(aop_detail_id):
    try:
        aop_detail_data = request.get_json()
        required_fields = ['aop_id', 'cost_center_code', 'amount']
        if not aop_detail_data or any(field not in aop_detail_data for field in required_fields):
           return jsonify({'error': 'Invalid AOP Detail data. aop_id, cost_center_code, and amount are required.'}), 400

        try:
            aop_detail_data['amount'] = float(aop_detail_data['amount'])
        except ValueError:
            return jsonify({'error': 'amount must be a number'}), 400

        cost_center = cost_center_service.get_cost_center_by_code(aop_detail_data['cost_center_code'])
        if not cost_center:
             return jsonify({'error': 'Invalid cost_center_code. Cost Center does not exist.'}), 400

        if aop_service.update_aop_detail(aop_detail_id, aop_detail_data):
            return jsonify({'message': 'AOP Detail updated successfully'}), 200
        else:
            return jsonify({'message': 'AOP Detail not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aop_bp.route('/details/<aop_detail_id>', methods=['DELETE'])
def delete_aop_detail(aop_detail_id):
    try:
        if aop_service.delete_aop_detail(aop_detail_id):
            return jsonify({'message': 'AOP Detail deleted successfully'}), 204
        else:
            return jsonify({'message': 'AOP Detail not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aop_bp.route('/details/by-aop/<aop_id>/with-names', methods=['GET'])
def get_aop_details_with_names(aop_id):
    try:
        details = aop_service.get_aop_details_with_cost_center_names(aop_id)
        return jsonify(details), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aop_bp.route('/details/total-amount/<aop_id>', methods=['GET'])
def get_total_detail_amount(aop_id):
    try:
        total_amount = aop_service.get_total_aop_detail_amount(aop_id)
        return jsonify({'total_amount': total_amount}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500