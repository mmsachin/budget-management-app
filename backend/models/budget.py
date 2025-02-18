# backend/models/budget.py
class Budget:
    def __init__(self, budget_id, aop_id, project, description, amount, ldap):
        self.budget_id = budget_id
        self.aop_id = aop_id
        self.project = project
        self.description = description
        self.amount = amount
        self.ldap = ldap

    def to_dict(self):
        return {
            'budget_id': self.budget_id,
            'aop_id': self.aop_id,
            'project': self.project,
            'description': self.description,
            'amount': self.amount,
            'ldap': self.ldap
        }