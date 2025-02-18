# Phase 2 Summary: Budget Management Application

This document summarizes the project structure, file contents, and key decisions made during Phase 2 of the development of the Budget Management Application.

## Project Structure

budget-management-app/
├── backend/
│ ├── api/
│ │ ├── aop_api.py
│ │ ├── budget_api.py
│ │ ├── cost_center_api.py
│ │ ├── employee_api.py
│ │ └── report_api.py
│ ├── models/
│ │ ├── aop.py
│ │ ├── budget.py
│ │ ├── cost_center.py
│ │ ├── employee.py
│ ├── services/
│ ├── aop_service.py
│ ├── budget_service.py
│ ├── cost_center_service.py
│ ├── employee_service.py
│ ├── app.py
│ ├── database.py
│ └── utils.py
├── frontend/
│ ├── assets/
│ └── logo-placeholder.png
│ ├── src/
│ │ ├── app/
│ │ │ ├── aop/
│ │ │ │ ├── aop-create/
│ │ │ │ │ └── aop-create.component.js
│ │ │ │ ├── aop-list/
│ │ │ │ │ └── aop-list.component.js
│ │ │ │ └── aop.service.js
│ │ │ ├── budget/
│ │ │ │ ├── budget-create/
│ │ │ │ │ └── budget-create.component.js
│ │ │ │ ├── budget-list/
│ │ │ │ │ └── budget-list.component.js
│ │ │ │ └── budget.service.js
│ │ │ ├── cost-center/
│ │ │ │ ├── cost-center-create/
│ │ │ │ │ └── cost-center-create.component.js
│ │ │ │ ├── cost-center-list/
│ │ │ │ │ └── cost-center-list.component.js
│ │ │ │ └── cost-center.service.js
│ │ │ ├── employee/
│ │ │ │ ├── employee-create/
│ │ │ │ │ └── employee-create.component.js
│ │ │ │ ├── employee-list/
│ │ │ │ │ └── employee-list.component.js
│ │ │ │ └── employee.service.js
│ │ │ ├── report/
│ │ │ │ └── report.component.js
│ │ │ ├── dashboard/
│ │ │ │ └── dashboard.component.js
│ │ │ ├── login/
│ │ │ │ └── login.component.js
│ │ │ │ └── login.component.html
│ │ │ ├── app-routing.module.js
│ │ │ ├── app.component.html
│ │ │ ├── app.component.js <- DELETED
│ │ │ └── app.module.js
│ │ ├── index.html
│ │ └── styles.css
│ ├── package-lock.json
│ └── package.json
├── .gitignore
└── README.md

## File Contents

Below are the contents of each file created or modified during Phase 2.

### Backend Files

*   **`backend/app.py`:**

```python
# backend/app.py
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello_world():
    return jsonify({'message': 'Hello from Flask!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
	

# backend/api/aop_api.py
from flask import Blueprint, request, jsonify

cost_center_bp = Blueprint('cost_center', __name__, url_prefix='/costcenters')

@cost_center_bp.route('/', methods=['GET'])
def get_cost_centers():
    # TODO: Implement fetching all cost centers
    return jsonify([])

@cost_center_bp.route('/<cost_center_code>', methods=['GET'])
def get_cost_center(cost_center_code):
    # TODO: Implement fetching a single cost center by code
    return jsonify({})

@cost_center_bp.route('/', methods=['POST'])
def create_cost_center():
    # TODO: Implement creating a new cost center
    return jsonify({}), 201

@cost_center_bp.route('/<cost_center_code>', methods=['PUT'])
def update_cost_center(cost_center_code):
    # TODO: Implement updating a cost center
    return jsonify({})

@cost_center_bp.route('/<cost_center_code>', methods=['DELETE'])
def delete_cost_center(cost_center_code):
    # TODO: Implement deleting a cost center
    return jsonify({}), 204
	
# backend/api/budget_api.py
from flask import Blueprint, request, jsonify

budget_bp = Blueprint('budget', __name__, url_prefix='/budgets')

@budget_bp.route('/', methods=['GET'])
def get_budgets():
    # TODO: Implement fetching all budgets
    return jsonify([])

@budget_bp.route('/<budget_id>', methods=['GET'])
def get_budget(budget_id):
    # TODO: Implement fetching a single budget by ID
    return jsonify({})

@budget_bp.route('/', methods=['POST'])
def create_budget():
    # TODO: Implement creating a new budget
    return jsonify({}), 201

@budget_bp.route('/<budget_id>', methods=['PUT'])
def update_budget(budget_id):
    # TODO: Implement updating a budget
    return jsonify({})

@budget_bp.route('/<budget_id>', methods=['DELETE'])
def delete_budget(budget_id):
    # TODO: Implement deleting a budget
    return jsonify({}), 204
	


# backend/api/cost_center_api.py
from flask import Blueprint, request, jsonify

cost_center_bp = Blueprint('cost_center', __name__, url_prefix='/costcenters')

@cost_center_bp.route('/', methods=['GET'])
def get_cost_centers():
    # TODO: Implement fetching all cost centers
    return jsonify([])

@cost_center_bp.route('/<cost_center_code>', methods=['GET'])
def get_cost_center(cost_center_code):
    # TODO: Implement fetching a single cost center by code
    return jsonify({})

@cost_center_bp.route('/', methods=['POST'])
def create_cost_center():
    # TODO: Implement creating a new cost center
    return jsonify({}), 201

@cost_center_bp.route('/<cost_center_code>', methods=['PUT'])
def update_cost_center(cost_center_code):
    # TODO: Implement updating a cost center
    return jsonify({})

@cost_center_bp.route('/<cost_center_code>', methods=['DELETE'])
def delete_cost_center(cost_center_code):
    # TODO: Implement deleting a cost center
    return jsonify({}), 204
	
	
# backend/api/employee_api.py
from flask import Blueprint, request, jsonify

employee_bp = Blueprint('employee', __name__, url_prefix='/employees')

@employee_bp.route('/', methods=['GET'])
def get_employees():
    # TODO: Implement fetching all employees
    return jsonify([])

@employee_bp.route('/<ldap>', methods=['GET'])
def get_employee(ldap):
    # TODO: Implement fetching a single employee by LDAP
    return jsonify({})

@employee_bp.route('/', methods=['POST'])
def create_employee():
    # TODO: Implement creating a new employee
    return jsonify({}), 201

@employee_bp.route('/<ldap>', methods=['PUT'])
def update_employee(ldap):
    # TODO: Implement updating an employee
    return jsonify({})

@employee_bp.route('/<ldap>', methods=['DELETE'])
def delete_employee(ldap):
    # TODO: Implement deleting an employee
    return jsonify({}), 204
	

# backend/api/report_api.py
from flask import Blueprint, request, jsonify

report_bp = Blueprint('report', __name__, url_prefix='/report')

@report_bp.route('/', methods=['GET'])
def get_report():
    # TODO: Implement fetching and returning the budget report
    return jsonify([])
	
# backend/models/aop.py

class AOPHeader:
    # TODO: Define AOPHeader model properties (aop_id, name, total_amount, state)
    pass

class AOPDetail:
    # TODO: Define AOPDetail model properties (aop_detail_id, aop_id, cost_center_code, amount)
    pass
	
	
# backend/models/budget.py
class Budget:
    # TODO: Define Budget model properties (budget_id, aop_id, project, description, amount, ldap)
    pass


# backend/models/cost_center.py
class CostCenter:
    # TODO: Define CostCenter model properties (cost_center_code, cost_center_name)
    pass
	
# backend/models/employee.py
class Employee:
    # TODO: Define Employee model properties (ldap, first_name, last_name, email, level, cost_center_code)
    pass
	
	
# backend/services/aop_service.py
# TODO Implement CRUD methods

# backend/services/budget_service.py
# TODO Implement CRUD methods

# backend/services/cost_center_service.py
# TODO Implement CRUD methods

# backend/services/employee_service.py
# TODO Implement CRUD methods

# backend/database.py
# TODO Implement

# backend/utils.py

# TODO: Add utility functions (e.g., data validation, authentication helpers)

<!-- frontend/src/index.html -->
<!DOCTYPE html>
<html ng-app="budgetApp">
<head>
    <title>Budget Management App</title>
    <base href="/">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div ng-view></div>

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular-route.min.js"></script>
    <script src="app/app.module.js"></script>
    <script src="app/app-routing.module.js"></script>
    <script src="app/login/login.component.js"></script>
    <script src="app/dashboard/dashboard.component.js"></script>
</body>
</html>

// frontend/src/app/app.module.js
angular.module('budgetApp', ['ngRoute']);

// frontend/src/app/app-routing.module.js
angular.module('budgetApp')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/login', {
        template: '<login></login>'
      })
      .when('/dashboard', {
        template: '<dashboard></dashboard>'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }])
  .run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (next && next.templateUrl && next.templateUrl !== 'app/login/login.component.html' && !$rootScope.isLoggedIn) {
        $location.path('/login');
        event.preventDefault();
      }
    });
  }]);
  
  
 <!-- frontend/src/app/login/login.component.html -->
<div class="login-container">
  <div class="login-header">
    <img src="assets/logo-placeholder.png" alt="Budget Management App Logo" class="logo">
    <h1>Budget Management App</h1>
    <h2>FP&A Hackathon</h2>
  </div>
  <form ng-submit="$ctrl.login()" class="login-form">
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" ng-model="$ctrl.password" required>
    </div>
    <button type="submit">Login</button>
    <p ng-if="$ctrl.loginError" class="error-message">{{ $ctrl.loginError }}</p>
  </form>
</div>


// frontend/src/app/login/login.component.js
angular.module('budgetApp')
  .component('login', {
    templateUrl: 'app/login/login.component.html',
    controller: function($location, $rootScope) { // Inject $location and $rootScope
      this.password = '';
      this.loginError = '';

      this.login = function() {
        if (this.password === 'IKnowYou241202') {
          // Successful login
          $rootScope.isLoggedIn = true; // Set a flag on $rootScope
          $location.path('/dashboard'); // Redirect to the dashboard
        } else {
          // Incorrect password
          this.loginError = 'Incorrect password. Please try again.';
          $rootScope.isLoggedIn = false;
        }
      };
    }
  });
  
 
 <!-- frontend/src/app/dashboard/dashboard.component.html -->
<h1>Welcome to the Dashboard</h1>
<p>This is a placeholder for the dashboard content.</p>


// frontend/src/app/dashboard/dashboard.component.js
angular.module('budgetApp')
  .component('dashboard', {
    templateUrl: 'app/dashboard/dashboard.component.html',
    controller: function() {
      // Dashboard controller logic (if any) can go here
    }
  });
  
 /* frontend/src/styles.css */
body {
  font-family: sans-serif;
  background-color: #f0f2f5; /* Light gray background */
  margin: 0; /* Remove default body margin */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ensure the container takes at least the full viewport height */
}

.login-container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px; /* Set a fixed width */
  text-align: center; /* Center the content */
}

.login-header {
  margin-bottom: 30px;
}

.logo {
  max-width: 150px; /* Adjust as needed */
  height: auto;
  margin-bottom: 20px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
  text-align: left;
}

.login-form input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Include padding and border in the element's total width */
}

.login-form button {
  background-color: #4CAF50; /* Green button */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.login-form button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 10px;
}

frontend/package.json
{
    "name": "budget-management-frontend",
    "version": "1.0.0",
    "scripts": {
      "start": "python -m http.server 8000"
    },
    "dependencies": {}
  }
  
 .gitignore
 node_modules/