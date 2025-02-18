# backend/services/user_service.py
from typing import List, Optional
from google.cloud import spanner
from database import get_db
from models.user import User

class UserService:
    @staticmethod
    def create_user(user_data: dict) -> str:
        try:
            user = User.from_dict(user_data)
            user.validate()

            db = get_db()
            with db.batch() as batch:
                batch.insert(
                    table='Users',
                    columns=('ldap', 'first_name', 'last_name', 'email', 'level', 'cost_center_code'),
                    values=[(
                        user.ldap,
                        user.first_name,
                        user.last_name,
                        user.email,
                        user.level,
                        user.cost_center_code
                    )]
                )
            return user.ldap

        except ValueError as e:
            raise ValueError(f"Invalid user data: {str(e)}")
        except Exception as e:
            raise Exception(f"Error creating user: {str(e)}")

    @staticmethod
    def get_all_users() -> List[dict]:
        try:
            db = get_db()
            users = []

            with db.snapshot() as snapshot:
                results = snapshot.read(
                    table='Users',
                    columns=('ldap', 'first_name', 'last_name', 'email', 'level', 'cost_center_code'),
                    keyset=spanner.KeySet(all_=True)
                )

                for row in results:
                    user = User(*row)
                    users.append(user.to_dict())

            return users

        except Exception as e:
            raise Exception(f"Error fetching users: {str(e)}")

    @staticmethod
    def get_user_by_ldap(ldap: str) -> Optional[dict]:
        try:
            db = get_db()
            with db.snapshot() as snapshot:
                results = snapshot.read(
                    table='Users',
                    columns=('ldap', 'first_name', 'last_name', 'email', 'level', 'cost_center_code'),
                    keyset=spanner.KeySet(keys=[(ldap,)]),
                    limit=1
                )

                rows = list(results)
                if rows:
                    user = User(*rows[0])
                    return user.to_dict()
                return None

        except Exception as e:
            raise Exception(f"Error fetching user: {str(e)}")

    @staticmethod
    def update_user(ldap: str, user_data: dict) -> bool:
        try:
            user = User.from_dict({
                'ldap': ldap,
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'email': user_data['email'],
                'level': user_data.get('level'),
                'cost_center_code': user_data.get('cost_center_code')
            })
            user.validate()

            db = get_db()
            with db.batch() as batch:
                batch.update(
                    table='Users',
                    columns=('ldap', 'first_name', 'last_name', 'email', 'level', 'cost_center_code'),
                    values=[(
                        ldap,
                        user_data['first_name'],
                        user_data['last_name'],
                        user_data['email'],
                        user_data.get('level'),
                        user_data.get('cost_center_code')
                    )]
                )
            return True

        except ValueError as e:
            raise ValueError(f"Invalid update data: {str(e)}")
        except Exception as e:
            raise Exception(f"Error updating user: {str(e)}")

    @staticmethod
    def delete_user(ldap: str) -> bool:
        try:
            db = get_db()
            with db.batch() as batch:
                batch.delete(
                    table='Users',
                    keyset=spanner.KeySet(keys=[(ldap,)])
                )
            return True

        except Exception as e:
            raise Exception(f"Error deleting user: {str(e)}")