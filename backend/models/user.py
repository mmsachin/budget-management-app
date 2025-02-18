# backend/models/user.py
from typing import Dict, Any

class User:
    def __init__(self, ldap: str, first_name: str, last_name: str, email: str, level: str = None, cost_center_code: str = None):
        if not ldap or not ldap.strip():
            raise ValueError("LDAP cannot be empty")
        if not first_name or not first_name.strip():
            raise ValueError("First name cannot be empty")
        if not last_name or not last_name.strip():
            raise ValueError("Last name cannot be empty")
        if not email or not email.strip():
            raise ValueError("Email cannot be empty")

        self.ldap = ldap.strip()
        self.first_name = first_name.strip()
        self.last_name = last_name.strip()
        self.email = email.strip()
        self.level = level.strip() if level else None
        self.cost_center_code = cost_center_code.strip() if cost_center_code else None

    def to_dict(self) -> Dict[str, Any]:
        return {
            'ldap': self.ldap,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'level': self.level,
            'cost_center_code': self.cost_center_code
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'User':
        if not isinstance(data, dict):
            raise ValueError("Input must be a dictionary")

        required_fields = ['ldap', 'first_name', 'last_name', 'email']
        if not all(field in data for field in required_fields):
            raise ValueError(f"Missing required fields: {required_fields}")

        return User(
            ldap=data['ldap'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            level=data.get('level'),
            cost_center_code=data.get('cost_center_code')
        )

    def validate(self) -> bool:
        if len(self.ldap) > 255:
            raise ValueError("LDAP cannot exceed 255 characters")
        if len(self.first_name) > 255:
            raise ValueError("First name cannot exceed 255 characters")
        if len(self.last_name) > 255:
            raise ValueError("Last name cannot exceed 255 characters")
        if len(self.email) > 255:
            raise ValueError("Email cannot exceed 255 characters")
        if self.level and len(self.level) > 50:
            raise ValueError("Level cannot exceed 50 characters")
        return True