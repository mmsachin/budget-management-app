# backend/services/purchase_order_service.py
from google.cloud import spanner
from database import get_db

def get_all_purchase_orders():
    db = get_db()
    purchase_orders = []
    try:
        with db.snapshot() as snapshot:
            results = snapshot.read(
                table='PurchaseOrders',
                columns=('po_id', 'po_number', 'po_line_number', 'requestor_ldap', 
                        'budget_id', 'purchase_item', 'amount', 'po_date'),
                keyset=spanner.KeySet(all_=True)
            )
            for row in results:
                purchase_orders.append({
                    'po_id': row[0],
                    'po_number': row[1],
                    'po_line_number': row[2],
                    'requestor_ldap': row[3],
                    'budget_id': row[4],
                    'purchase_item': row[5],
                    'amount': row[6],
                    'po_date': row[7].isoformat() if row[7] else None
                })
        return purchase_orders
    except Exception as e:
        print(f"Error getting purchase orders: {e}")
        raise

def get_purchase_order_by_id(po_id):
    db = get_db()
    try:
        with db.snapshot() as snapshot:
            result = snapshot.read(
                table='PurchaseOrders',
                columns=('po_id', 'po_number', 'po_line_number', 'requestor_ldap', 
                        'budget_id', 'purchase_item', 'amount', 'po_date'),
                keyset=spanner.KeySet(keys=[(int(po_id),)]),
                limit=1
            )
            rows = list(result)
            if rows:
                row = rows[0]
                return {
                    'po_id': row[0],
                    'po_number': row[1],
                    'po_line_number': row[2],
                    'requestor_ldap': row[3],
                    'budget_id': row[4],
                    'purchase_item': row[5],
                    'amount': row[6],
                    'po_date': row[7].isoformat() if row[7] else None
                }
            return None
    except Exception as e:
        print(f"Error getting purchase order by ID: {e}")
        raise

def get_purchase_orders_by_ldap(ldap):
    db = get_db()
    purchase_orders = []
    try:
        with db.snapshot() as snapshot:
            results = snapshot.read(
                table='PurchaseOrders',
                columns=('po_id', 'po_number', 'po_line_number', 'requestor_ldap', 
                        'budget_id', 'purchase_item', 'amount', 'po_date'),
                keyset=spanner.KeySet(all_=True)
            )
            for row in results:
                if row[3] == ldap:  # Check if requestor_ldap matches
                    purchase_orders.append({
                        'po_id': row[0],
                        'po_number': row[1],
                        'po_line_number': row[2],
                        'requestor_ldap': row[3],
                        'budget_id': row[4],
                        'purchase_item': row[5],
                        'amount': row[6],
                        'po_date': row[7].isoformat() if row[7] else None
                    })
        return purchase_orders
    except Exception as e:
        print(f"Error getting purchase orders by LDAP: {e}")
        raise