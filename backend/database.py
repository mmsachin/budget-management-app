# backend/database.py
from google.cloud import spanner
import os

INSTANCE_ID = 'budget-management'
DATABASE_ID = 'budget-db'

# Initialize Spanner client
spanner_client = spanner.Client()
instance = spanner_client.instance(INSTANCE_ID)
database = instance.database(DATABASE_ID)

def get_db():
    """Returns the Spanner database object."""
    return database