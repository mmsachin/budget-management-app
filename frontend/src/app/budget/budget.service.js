// frontend/src/app/budget/budget.service.js
angular.module('budgetApp')
  .service('budgetService', ['$http', function($http) {
    const apiUrl = 'http://localhost:5000/budgets';
    
    // Common config for all requests
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };

    this.getAllBudgets = function() {
      return $http.get(apiUrl, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error fetching budgets:", error);
          throw error;
        });
    };

    this.getBudget = function(budgetId) {
      return $http.get(`${apiUrl}/${budgetId}`, config)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error fetching budget ${budgetId}:`, error);
          throw error;
        });
    };

    this.createBudget = function(budgetData) {
      return $http.post(apiUrl, budgetData, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error creating budget:", error);
          throw error;
        });
    };

    this.updateBudget = function(budgetId, budgetData) {
      return $http.put(`${apiUrl}/${budgetId}`, budgetData, config)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error updating budget ${budgetId}:`, error);
          throw error;
        });
    };

    this.deleteBudget = function(budgetId) {
      return $http.delete(`${apiUrl}/${budgetId}`, config)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error deleting budget ${budgetId}:`, error);
          throw error;
        });
    };
  }]);