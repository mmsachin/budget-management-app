# backend/services/cost_center_service.py
from typing import List, Optional
from google.cloud import spanner
from database import get_db
from models.cost_center import CostCenter

class CostCenterService:
    @staticmethod
    def create_cost_center(cost_center_data: dict) -> str:
        try:
            cost_center = CostCenter.from_dict(cost_center_data)
            cost_center.validate()

            db = get_db()
            with db.batch() as batch:
                batch.insert(
                    table='CostCenters',
                    columns=('cost_center_code', 'cost_center_name'),
                    values=[(
                        cost_center.cost_center_code,
                        cost_center.cost_center_name
                    )]
                )
            return cost_center.cost_center_code

        except ValueError as e:
            raise ValueError(f"Invalid cost center data: {str(e)}")
        except Exception as e:
            raise Exception(f"Error creating cost center: {str(e)}")

    @staticmethod
    def get_all_cost_centers() -> List[dict]:
        try:
            db = get_db()
            cost_centers = []

            with db.snapshot() as snapshot:
                results = snapshot.read(
                    table='CostCenters',
                    columns=('cost_center_code', 'cost_center_name'),
                    keyset=spanner.KeySet(all_=True)
                )

                for row in results:
                    cost_center = CostCenter(*row)
                    cost_centers.append(cost_center.to_dict())

            return cost_centers

        except Exception as e:
            raise Exception(f"Error fetching cost centers: {str(e)}")

    @staticmethod
    def get_cost_center_by_code(cost_center_code: str) -> Optional[dict]:
        try:
            db = get_db()
            with db.snapshot() as snapshot:
                results = snapshot.read(
                    table='CostCenters',
                    columns=('cost_center_code', 'cost_center_name'),
                    keyset=spanner.KeySet(keys=[(cost_center_code,)]),
                    limit=1
                )

                rows = list(results)
                if rows:
                    cost_center = CostCenter(*rows[0])
                    return cost_center.to_dict()
                return None

        except Exception as e:
            raise Exception(f"Error fetching cost center: {str(e)}")

    @staticmethod
    def update_cost_center(cost_center_code: str, cost_center_data: dict) -> bool:
        try:
            cost_center = CostCenter.from_dict({
                'cost_center_code': cost_center_code,
                'cost_center_name': cost_center_data['cost_center_name']
            })
            cost_center.validate()

            db = get_db()
            with db.batch() as batch:
                batch.update(
                    table='CostCenters',
                    columns=('cost_center_code', 'cost_center_name'),
                    values=[(
                        cost_center_code,
                        cost_center_data['cost_center_name']
                    )]
                )
            return True

        except ValueError as e:
            raise ValueError(f"Invalid update data: {str(e)}")
        except Exception as e:
            raise Exception(f"Error updating cost center: {str(e)}")

    @staticmethod
    def delete_cost_center(cost_center_code: str) -> bool:
        try:
            db = get_db()

            with db.snapshot() as snapshot:
                employee_results = snapshot.read(
                    table='Employees',
                    columns=('ldap',),
                    keyset=spanner.KeySet(keys=[(cost_center_code,)]),
                    limit=1
                )

                if list(employee_results):
                    raise ValueError("Cannot delete cost center: Referenced by existing employees")
            with db.batch() as batch:
                batch.delete(
                    table='CostCenters',
                    keyset=spanner.KeySet(keys=[(cost_center_code,)])
                )
            return True

        except ValueError as e:
            raise ValueError(str(e))
        except Exception as e:
            raise Exception(f"Error deleting cost center: {str(e)}")