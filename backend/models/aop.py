# backend/models/aop.py
class AopHeader:
    def __init__(self, aop_id, name, total_amount, state):
        self.aop_id = aop_id
        self.name = name
        self.total_amount = total_amount
        self.state = state

    def to_dict(self):
        return {
            'aop_id': self.aop_id,
            'aop_name': self.name,
            'total_amount': self.total_amount,
            'status': self.state
        }


class AopDetail:
    def __init__(self, aop_id, aop_detail_id, cost_center_code, amount):
        self.aop_id = aop_id
        self.aop_detail_id = aop_detail_id
        self.cost_center_code = cost_center_code
        self.amount = amount

    def to_dict(self):
        return {
            'aop_id': self.aop_id,
            'aop_detail_id': self.aop_detail_id,
            'cost_center_code': self.cost_center_code,
            'amount': self.amount
        }