// frontend/src/app/cost-center/cost-center.service.js
angular.module('budgetApp')
.service('costCenterService', ['$http', function($http) {
    const apiUrl = 'http://localhost:5000/costcenters';
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };
    
    this.getAllCostCenters = function() {
        return $http.get(apiUrl, config)
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching cost centers:", error);
                throw error;
            });
    };

    this.getCostCenter = function(costCenterCode) {
        return $http.get(`${apiUrl}/${costCenterCode}`, config)
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching cost center:", error);
                throw error;
            });
    };

    this.createCostCenter = function(costCenterData) {
        return $http.post(apiUrl, costCenterData, config)
            .then(response => response.data)
            .catch(error => {
                console.error("Error creating cost center:", error);
                throw error;
            });
    };

    this.updateCostCenter = function(costCenterCode, costCenterData) {
        return $http.put(`${apiUrl}/${costCenterCode}`, costCenterData, config)
            .then(response => response.data)
            .catch(error => {
                console.error("Error updating cost center:", error);
                throw error;
            });
    };

    this.deleteCostCenter = function(costCenterCode) {
        return $http.delete(`${apiUrl}/${costCenterCode}`, config)
            .then(response => response.data)
            .catch(error => {
                console.error("Error deleting cost center:", error);
                throw error;
            });
    };
}]);