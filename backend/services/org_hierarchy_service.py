# backend/services/org_hierarchy_service.py
import random
from google.cloud import spanner
from database import get_db
from services.user_service import UserService  # Import UserService


def generate_int64_id():
    return random.randint(-(2**63), (2**63)-1)

class OrgHierarchyService:
    @staticmethod
    def create_relationship(relationship_data: dict) -> int:
        """Creates a new manager-employee relationship."""
        db = get_db()
        try:
            with db.batch() as batch:
                relationship_id = generate_int64_id()
                batch.insert(
                    table='ManagerUserRelationships',
                    columns=('relationship_id', 'employee_ldap', 'manager_ldap'),
                    values=[(
                        relationship_id,
                        relationship_data['employee_ldap'],
                        relationship_data['manager_ldap']
                    )]
                )
            return relationship_id
        except Exception as e:
            raise Exception(f"Error creating relationship: {str(e)}")

    @staticmethod
    def get_all_relationships() -> list:
        """Retrieves all manager-employee relationships."""
        db = get_db()
        relationships = []
        try:
            with db.snapshot() as snapshot:
                results = snapshot.read(
                    table='ManagerUserRelationships',
                    columns=('relationship_id', 'employee_ldap', 'manager_ldap'),
                    keyset=spanner.KeySet(all_=True)
                )
                for row in results:
                    relationships.append({
                        'relationship_id': row[0],
                        'employee_ldap': row[1],
                        'manager_ldap': row[2]
                    })
            return relationships
        except Exception as e:
            raise Exception(f"Error fetching relationships: {str(e)}")

    @staticmethod
    def get_relationship_by_id(relationship_id: int) -> dict | None:
        """Retrieves a specific relationship by its ID."""
        db = get_db()
        try:
            with db.snapshot() as snapshot:
                results = snapshot.read(
                    table='ManagerUserRelationships',
                    columns=('relationship_id', 'employee_ldap', 'manager_ldap'),
                    keyset=spanner.KeySet(keys=[(int(relationship_id),)]),
                    limit=1
                )
                rows = list(results)
                if rows:
                    return {
                        'relationship_id': rows[0][0],
                        'employee_ldap': rows[0][1],
                        'manager_ldap': rows[0][2]
                    }
                return None
        except Exception as e:
            raise Exception(f"Error fetching relationship: {str(e)}")

    @staticmethod
    def get_relationships_by_manager(manager_ldap: str) -> list:
        """Retrieves all relationships where the given LDAP is the manager."""
        db = get_db()  # Corrected indentation
        relationships = []
        try:
            with db.snapshot() as snapshot:
                results = snapshot.read(
                    table='ManagerUserRelationships',
                    columns=('relationship_id', 'employee_ldap', 'manager_ldap'),
                    keyset=spanner.KeySet(all_=True)
                )
                for row in results:
                    if row[2] == manager_ldap:
                        relationships.append({
                            'relationship_id': row[0],
                            'employee_ldap': row[1],
                            'manager_ldap': row[2]
                        })
            return relationships
        except Exception as e:
            raise Exception(f"Error fetching relationships by manager: {str(e)}")

    @staticmethod
    def get_relationships_by_employee(employee_ldap: str) -> list:
        """Retrieves all relationships where the given LDAP is the employee."""
        db = get_db()
        relationships = []
        try:
            with db.snapshot() as snapshot:
                results = snapshot.read(
                    table='ManagerUserRelationships',
                    columns=('relationship_id', 'employee_ldap', 'manager_ldap'),
                    keyset=spanner.KeySet(all_=True)
                )
                for row in results:
                    if row[1] == employee_ldap:
                        relationships.append({
                            'relationship_id': row[0],
                            'employee_ldap': row[1],
                            'manager_ldap': row[2]
                        })
            return relationships
        except Exception as e:
            raise Exception(f"Error fetching relationships by employee: {str(e)}")


    @staticmethod
    def update_relationship(relationship_id: int, relationship_data: dict) -> bool:
        """Updates an existing manager-employee relationship."""
        db = get_db()
        try:
            with db.batch() as batch:
                batch.update(
                    table='ManagerUserRelationships',
                    columns=('relationship_id', 'employee_ldap', 'manager_ldap'),
                    values=[(
                        int(relationship_id),
                        relationship_data['employee_ldap'],
                        relationship_data['manager_ldap']
                    )]
                )
            return True
        except Exception as e:
            raise Exception(f"Error updating relationship: {str(e)}")

    @staticmethod
    def delete_relationship(relationship_id: int) -> bool:
        """Deletes a manager-employee relationship."""
        db = get_db()
        try:
            with db.batch() as batch:
                batch.delete(
                    table='ManagerUserRelationships',
                    keyset=spanner.KeySet(keys=[(int(relationship_id),)])
                )
            return True
        except Exception as e:
            raise Exception(f"Error deleting relationship: {str(e)}")
    
    @staticmethod
    def get_hierarchy_for_manager(manager_ldap: str) -> list:
        """
        Retrieves the reporting hierarchy for a given manager. This is a
        recursive function.
        """
        db = get_db()
        hierarchy = []
    
        try:
            with db.snapshot() as snapshot:
                results = snapshot.read(
                    table='ManagerUserRelationships',
                    columns=('employee_ldap', 'manager_ldap'),  # Need both ldap now
                    keyset=spanner.KeySet(all_=True)
                )
    
                # Build dictionary: manager -> list of direct reports
                direct_reports = {}
                for row in results:
                  if row[1] == manager_ldap:
                    if row[1] not in direct_reports:
                        direct_reports[row[1]] = []
                    direct_reports[row[1]].append(row[0])  # row[0] is employee_ldap
    
                # Recursively fetch subordinates for each direct report
                for manager_ldap_key in direct_reports:  # Iterate over managers
                   for employee_ldap in direct_reports[manager_ldap_key]:
                        employee_details = UserService.get_user_by_ldap(employee_ldap)
                        if employee_details:
                            employee_data = {
                                'ldap': employee_details['ldap'],
                                'first_name': employee_details['first_name'],
                                'last_name': employee_details['last_name'],
                                'subordinates': OrgHierarchyService.get_hierarchy_for_manager(employee_ldap)  # Recurse!
                            }
                            hierarchy.append(employee_data)
                return hierarchy
        except Exception as e:
            raise Exception(f"Error fetching hierarchy for manager: {str(e)}")