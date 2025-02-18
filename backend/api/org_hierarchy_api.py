# backend/api/org_hierarchy_api.py
from flask import Blueprint, request, jsonify
from services.org_hierarchy_service import OrgHierarchyService
from services.user_service import UserService  # Import UserService

org_hierarchy_bp = Blueprint('org_hierarchy', __name__, url_prefix='/org-hierarchy')

@org_hierarchy_bp.route('/relationships', methods=['POST'])
def create_relationship():
    try:
        relationship_data = request.get_json()
        if not all(k in relationship_data for k in ('employee_ldap', 'manager_ldap')):
            return jsonify({'error': 'Invalid relationship data.  employee_ldap and manager_ldap are required.'}), 400

        # Check if both employee and manager exist
        if not UserService.get_user_by_ldap(relationship_data['employee_ldap']):
            return jsonify({'error': 'Employee LDAP does not exist.'}), 400
        if not UserService.get_user_by_ldap(relationship_data['manager_ldap']):
            return jsonify({'error': 'Manager LDAP does not exist.'}), 400

        relationship_id = OrgHierarchyService.create_relationship(relationship_data)
        return jsonify({'relationship_id': relationship_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@org_hierarchy_bp.route('/relationships', methods=['GET'])
def get_all_relationships():
    try:
        relationships = OrgHierarchyService.get_all_relationships()
        return jsonify(relationships), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@org_hierarchy_bp.route('/relationships/<relationship_id>', methods=['GET'])
def get_relationship(relationship_id):
    try:
        relationship = OrgHierarchyService.get_relationship_by_id(relationship_id)
        if relationship:
            return jsonify(relationship), 200
        else:
            return jsonify({'message': 'Relationship not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@org_hierarchy_bp.route('/relationships/manager/<manager_ldap>', methods=['GET'])
def get_relationships_by_manager(manager_ldap):
    try:
        relationships = OrgHierarchyService.get_relationships_by_manager(manager_ldap)
        return jsonify(relationships), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@org_hierarchy_bp.route('/relationships/employee/<employee_ldap>', methods=['GET'])
def get_relationships_by_employee(employee_ldap):
    try:
        relationships = OrgHierarchyService.get_relationships_by_employee(employee_ldap)
        return jsonify(relationships), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@org_hierarchy_bp.route('/relationships/<relationship_id>', methods=['PUT'])
def update_relationship(relationship_id):
    try:
        relationship_data = request.get_json()
         # Check if both employee and manager exist
        if not UserService.get_user_by_ldap(relationship_data['employee_ldap']):
            return jsonify({'error': 'Employee LDAP does not exist.'}), 400
        if not UserService.get_user_by_ldap(relationship_data['manager_ldap']):
            return jsonify({'error': 'Manager LDAP does not exist.'}), 400
        if OrgHierarchyService.update_relationship(relationship_id, relationship_data):
            return jsonify({'message': 'Relationship updated successfully'}), 200
        else:
            return jsonify({'message': 'Relationship not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@org_hierarchy_bp.route('/relationships/<relationship_id>', methods=['DELETE'])
def delete_relationship(relationship_id):
    try:
        if OrgHierarchyService.delete_relationship(relationship_id):
            return jsonify({'message': 'Relationship deleted successfully'}), 204
        else:
            return jsonify({'message': 'Relationship not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@org_hierarchy_bp.route('/manager/<manager_ldap>', methods=['GET'])
def get_hierarchy(manager_ldap):
    """
    Gets the reporting hierarchy for a given manager.
    """
    try:
        hierarchy = OrgHierarchyService.get_hierarchy_for_manager(manager_ldap)
        return jsonify(hierarchy), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500