# backend/api/budget_api.py
from flask import Blueprint, request, jsonify
from services import budget_service

budget_bp = Blueprint('budget', __name__, url_prefix='/budgets')

@budget_bp.route('/', methods=['GET'])
def get_budgets():
    try:
        budgets = budget_service.get_all_budgets()
        return jsonify(budgets)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/<budget_id>', methods=['GET'])
def get_budget(budget_id):
    print(f"Received budget_id: {budget_id}")
    try:
        budget = budget_service.get_budget_by_id(budget_id)
        if budget:
            return jsonify(budget)
        else:
            return jsonify({'message': 'Budget not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/', methods=['POST'])
def create_budget():
    try:
        budget_data = request.get_json()
        print("Budget data received:", budget_data)
        if not budget_data or 'amount' not in budget_data or 'project' not in budget_data:
            return jsonify({'error': 'Invalid budget data.  amount and project are required.'}), 400

        budget_id = budget_service.create_budget(budget_data)

        return jsonify({'budget_id': budget_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/<budget_id>', methods=['PUT'])
def update_budget(budget_id):
    try:
        budget_data = request.get_json()
        if not budget_data or 'amount' not in budget_data or 'project' not in budget_data:
            return jsonify({'error': 'Invalid budget data.  amount and project are required.'}), 400

        if budget_service.update_budget(budget_id, budget_data):
            return jsonify({'message': 'Budget updated successfully'})
        else:
            return jsonify({'message': 'Budget not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/<budget_id>', methods=['DELETE'])
def delete_budget(budget_id):
    try:
        if budget_service.delete_budget(budget_id):
            return jsonify({'message': 'Budget deleted successfully'}),204
        else:
            return jsonify({'message': 'Budget not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500