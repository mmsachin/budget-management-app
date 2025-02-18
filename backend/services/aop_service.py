# backend/services/aop_service.py
import random
from google.cloud import spanner
from database import get_db
from models.aop import AopHeader, AopDetail
from services import cost_center_service

def generate_int64_id():
    return random.randint(-(2**63), (2**63)-1)

def create_aop_header(aop_data):
    db = get_db()
    try:
        with db.batch() as batch:
            aop_id = generate_int64_id()
            batch.insert(
                table='AopHeaders',
                columns=('aop_id', 'name', 'total_amount', 'state'),
                values=[(
                    aop_id,
                    aop_data['aop_name'],
                    aop_data['total_amount'],
                    aop_data.get('status', 'draft')
                )]
            )
        return aop_id
    except Exception as e:
        print(f"Error creating AOP header: {e}")
        raise

def get_all_aop_headers():
    db = get_db()
    headers = []
    try:
        with db.snapshot() as snapshot:
            results = snapshot.read(
                table='AopHeaders',
                columns=('aop_id', 'name', 'total_amount', 'state'),
                keyset=spanner.KeySet(all_=True)
            )
            for row in results:
                headers.append(AopHeader(*row).to_dict())
        return headers
    except Exception as e:
        print(f"Error getting AOP headers: {e}")
        raise

def get_aop_header_by_id(aop_id):
    db = get_db()
    try:
        with db.snapshot() as snapshot:
            result = snapshot.read(
                table='AopHeaders',
                columns=('aop_id', 'name', 'total_amount', 'state'),
                keyset=spanner.KeySet(keys=[(int(aop_id),)]),  # Cast aop_id to int
                limit=1
            )
            rows = list(result)
            if rows:
                return AopHeader(*rows[0]).to_dict()
            return None
    except Exception as e:
        print(f"Error getting AOP header by ID: {e}")
        raise

def update_aop_header(aop_id, aop_data):
    db = get_db()
    try:
        with db.batch() as batch:
            batch.update(
                table='AopHeaders',
                columns=('aop_id', 'name', 'total_amount', 'state'),
                values=[(
                    int(aop_id),
                    aop_data['aop_name'],
                    aop_data['total_amount'],
                    aop_data['status'].lower()
                )]
            )
        return True
    except Exception as e:
        print(f"Error updating AOP header: {e}")
        raise

def delete_aop_header(aop_id):
    db = get_db()
    try:
        with db.batch() as batch:
            batch.delete(
                table='AopHeaders',
                keyset=spanner.KeySet(keys=[(int(aop_id),)])
            )
        return True
    except Exception as e:
        print(f"Error deleting AOP header: {e}")
        raise

def set_aop_status(aop_id, status):
    db = get_db()
    status = status.lower()
    if status == 'active':
        try:
            with db.transaction() as transaction:
                results = transaction.read(
                    table="AopHeaders",
                    columns=["aop_id", "state"],
                    keyset=spanner.KeySet(all_=True)
                )

                rows = list(results)
                active_aops = [row[0] for row in rows if row[1] == "active"]

                if len(active_aops) >1:
                    raise ValueError("Multiple active AOPs found. Cannot proceed.")

                for active_aop_id in active_aops:
                     transaction.update(
                        table='AopHeaders',
                        columns=('aop_id', 'state'),
                        values=[(active_aop_id, 'eol')]
                    )
                transaction.update(
                    table='AopHeaders',
                    columns=('aop_id', 'state'),
                    values=[(int(aop_id), status)]
                )
            return True
        except Exception as e:
            print(f"Error setting AOP status: {e}")
            raise
    else:
        try:
            with db.batch() as batch:
                batch.update(
                        table='AopHeaders',
                        columns=('aop_id', 'state'),
                        values=[(int(aop_id), status)]
                    )
            return True
        except Exception as e:
            print(f"Error setting AOP status: {e}")
            raise

def create_aop_detail(aop_detail_data):
    db = get_db()
    try:
        with db.batch() as batch:
            aop_detail_id = generate_int64_id()
            batch.insert(
                table='AopDetails',
                columns=('aop_detail_id', 'aop_id', 'cost_center_code', 'amount'),
                values=[(
                    aop_detail_id,
                    int(aop_detail_data['aop_id']),
                    aop_detail_data['cost_center_code'],
                    aop_detail_data['amount']
                )]
            )
        return aop_detail_id
    except Exception as e:
        print(f"Error creating AOP detail: {e}")
        raise

def get_aop_details_by_aop_id(aop_id):
    db = get_db()
    details = []
    try:
        with db.snapshot() as snapshot:
            results = snapshot.read(
                table='AopDetails',
                columns=('aop_detail_id', 'aop_id', 'cost_center_code', 'amount'),
                keyset=spanner.KeySet(all_=True)
            )
            for row in results:
              if row[1] == int(aop_id):
                details.append(AopDetail(*row).to_dict())
        return details
    except Exception as e:
        print(f"Error getting AOP details: {e}")
        raise

def get_aop_detail_by_id(aop_detail_id):
    db = get_db()
    try:
        with db.snapshot() as snapshot:
            result = snapshot.read(
                table='AopDetails',
                columns=('aop_detail_id', 'aop_id', 'cost_center_code', 'amount'),
                keyset=spanner.KeySet(keys=[(int(aop_detail_id),)]),
                limit=1
            )
            rows = list(result)
            if rows:
                return AopDetail(*rows[0]).to_dict()
            return None
    except Exception as e:
        print(f"Error getting AOP detail by ID: {e}")
        raise

def update_aop_detail(aop_detail_id, aop_detail_data):
    db = get_db()
    try:
        with db.batch() as batch:
            batch.update(
                table='AopDetails',
                columns=('aop_detail_id', 'aop_id', 'cost_center_code', 'amount'),
                values=[(
                    int(aop_detail_id),
                    int(aop_detail_data['aop_id']),
                    aop_detail_data['cost_center_code'],
                    aop_detail_data['amount']
                )]
            )
        return True
    except Exception as e:
        print(f"Error updating AOP detail: {e}")
        raise

def delete_aop_detail(aop_detail_id):
    db = get_db()
    try:
        with db.batch() as batch:
            batch.delete(
                table='AopDetails',
                keyset=spanner.KeySet(keys=[(int(aop_detail_id),)])
            )
        return True
    except Exception as e:
        print(f"Error deleting AOP detail: {e}")
        raise

def get_aop_details_with_cost_center_names(aop_id):
    db = get_db()
    details = []
    try:
        with db.snapshot() as snapshot:
            results = snapshot.read(
                table='AopDetails',
                columns=('aop_detail_id', 'aop_id', 'cost_center_code', 'amount'),
                keyset=spanner.KeySet(all_=True)
            )
            for row in results:
                if row[1] == int(aop_id):
                    detail = AopDetail(*row).to_dict()
                    cost_center = cost_center_service.get_cost_center_by_code(detail['cost_center_code'])
                    detail['cost_center_name'] = cost_center['cost_center_name'] if cost_center else 'N/A'
                    details.append(detail)
        return details
    except Exception as e:
        print(f"Error getting AOP details with names: {e}")
        raise

def get_total_aop_detail_amount(aop_id):
    db = get_db()
    total_amount = 0
    try:
        with db.snapshot() as snapshot:
            results = snapshot.execute_sql(
                "SELECT SUM(amount) FROM AopDetails WHERE aop_id = @aop_id",
                params={"aop_id": int(aop_id)},
                param_types={"aop_id": spanner.param_types.INT64},
            )
            for row in results:
                total_amount = row[0] if row[0] is not None else 0
            return total_amount
    except Exception as e:
        print(f"Error calculating total AOP detail amount: {e}")
        raise