# backend/services/budget_service.py
import uuid
from google.cloud import spanner
from database import get_db
from models.budget import Budget

def create_budget(budget_data):
    """Creates a new budget in Spanner."""
    db = get_db()
    try:
        with db.batch() as batch:
            budget_id = str(uuid.uuid4())  # Generate a UUID for budget_id
            batch.insert(
                table='Budgets',
                columns=('budget_id', 'aop_id', 'project', 'description', 'amount', 'ldap'),
                values=[(
                    budget_id,
                    budget_data.get('aop_id'),
                    budget_data.get('project'),
                    budget_data.get('description'),
                    budget_data.get('amount'),
                    budget_data.get('ldap')
                )]
            )
        return budget_id  # Return the ID of the newly created budget
    except Exception as e:
        print(f"Error creating budget: {e}")  # Log the error
        raise  # Re-raise the exception to be handled by the API layer


def get_all_budgets():
    """Retrieves all budgets from Spanner."""
    db = get_db()
    budgets = []
    try:
        with db.snapshot() as snapshot:
            results = snapshot.read(
                table='Budgets',
                columns=('budget_id', 'aop_id', 'project', 'description', 'amount', 'ldap'),
                keyset=spanner.KeySet(all_=True)  # Retrieve all rows
            )
            for row in results:
                budget = Budget(*row) # Create a Budget object from the row data
                budgets.append(budget.to_dict()) # convert to dict
        return budgets
    except Exception as e:
        print(f"Error getting budgets: {e}")
        raise

def get_budget_by_id(budget_id):
    """Retrieves a single budget by its ID."""
    db = get_db()
    try:
        with db.snapshot() as snapshot:
            result = snapshot.read(
                table='Budgets',
                columns=('budget_id', 'aop_id', 'project', 'description', 'amount', 'ldap'),
                keyset=spanner.KeySet(keys=[(budget_id,)]),  # KeySet for a single key
                 limit=1
            )
            rows = list(result) # since we use limit=1
            if rows:
                return Budget(*rows[0]).to_dict() # return the dict, or you could return the object and do conversion in api.
            else:
                return None  # Or raise a custom exception like BudgetNotFound

    except Exception as e:
        print(f"Error getting budget by ID: {e}")
        raise



def update_budget(budget_id, budget_data):
    """Updates an existing budget in Spanner."""
    db = get_db()
    try:
        with db.batch() as batch:
            batch.update(
                table='Budgets',
                columns=('budget_id', 'aop_id', 'project', 'description', 'amount', 'ldap'),
                values=[(
                    budget_id,
                    budget_data.get('aop_id'),
                    budget_data.get('project'),
                    budget_data.get('description'),
                    budget_data.get('amount'),
                    budget_data.get('ldap')
                )]
            )
        return True # Return True for success
    except Exception as e:
        print(f"Error updating budget: {e}")
        raise


def delete_budget(budget_id):
    """Deletes a budget from Spanner."""
    db = get_db()
    try:
        with db.batch() as batch:
            batch.delete(
                table='Budgets',
                keyset=spanner.KeySet(keys=[(budget_id,)])  # Delete by primary key
            )

        return True  # successful deletion

    except Exception as e:
        print(f"Error deleting budget: {e}")
        raise