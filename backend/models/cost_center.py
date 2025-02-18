# backend/models/cost_center.py
from typing import Dict, Any

class CostCenter:
    def __init__(self, cost_center_code: str, cost_center_name: str):
        if not cost_center_code or not cost_center_code.strip():
            raise ValueError("Cost center code cannot be empty")
        if not cost_center_name or not cost_center_name.strip():
            raise ValueError("Cost center name cannot be empty")

        self.cost_center_code = cost_center_code.strip()
        self.cost_center_name = cost_center_name.strip()

    def to_dict(self) -> Dict[str, Any]:
        return {
            'cost_center_code': self.cost_center_code,
            'cost_center_name': self.cost_center_name
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'CostCenter':
        if not isinstance(data, dict):
            raise ValueError("Input must be a dictionary")

        required_fields = ['cost_center_code', 'cost_center_name']
        if not all(field in data for field in required_fields):
            raise ValueError(f"Missing required fields: {required_fields}")

        return CostCenter(
            cost_center_code=data['cost_center_code'],
            cost_center_name=data['cost_center_name']
        )

    def validate(self) -> bool:
        if len(self.cost_center_code) > 50:
            raise ValueError("Cost center code cannot exceed 50 characters")
        if len(self.cost_center_name) > 255:
            raise ValueError("Cost center name cannot exceed 255 characters")
        if not self.cost_center_code.isalnum():
            raise ValueError("Cost center code must be alphanumeric")
        return True