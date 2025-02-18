# backend/api/user_api.py
from flask import Blueprint, request, jsonify
from services.user_service import UserService

user_bp = Blueprint('users', __name__, url_prefix='/users')

@user_bp.route('/', methods=['GET'])
def get_users():
    try:
        users = UserService.get_all_users()
        return jsonify(users)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<ldap>', methods=['GET'])
def get_user(ldap):
    try:
        user = UserService.get_user_by_ldap(ldap)
        if user:
            return jsonify(user)
        return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/', methods=['POST'])
def create_user():
    try:
        user_data = request.get_json()
        ldap = UserService.create_user(user_data)
        return jsonify({'ldap': ldap}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<ldap>', methods=['PUT'])
def update_user(ldap):
    try:
        user_data = request.get_json()
        success = UserService.update_user(ldap, user_data)
        if success:
            return jsonify({'message': 'User updated successfully'})
        return jsonify({'message': 'User not found'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<ldap>', methods=['DELETE'])
def delete_user(ldap):
    try:
        success = UserService.delete_user(ldap)
        if success:
            return jsonify({'message': 'User deleted successfully'}), 204
        return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500