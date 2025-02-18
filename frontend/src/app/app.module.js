// frontend/src/app/app.module.js
"use strict";

angular.module('budgetApp', ['ngRoute'])
  .service('budgetService', ['$http', function($http) {
    const apiUrl = '/api/budgets';
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
  }])
  .service('aopService', ['$http', function($http) {
    const apiUrl = '/api/aop';
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };

    this.getAllAopHeaders = function() {
      return $http.get(`${apiUrl}/headers`, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error fetching AOP Headers:", error);
          throw error;
        });
    };

    this.getAopHeader = function(aopId) {
      return $http.get(`${apiUrl}/headers/${aopId}`, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error fetching AOP Header:", error);
          throw error;
        });
    };

    this.createAopHeader = function(aopData) {
      return $http.post(`${apiUrl}/headers`, aopData, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error creating AOP Header:", error);
          throw error;
        });
    };

    this.updateAopHeader = function(aopId, aopData) {
      return $http.put(`${apiUrl}/headers/${aopId}`, aopData, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error updating AOP Header:", error);
          throw error;
        });
    };

    this.deleteAopHeader = function(aopId) {
      return $http.delete(`${apiUrl}/headers/${aopId}`, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error deleting AOP Header:", error);
          throw error;
        });
    };

    this.setAopHeaderStatus = function(aopId, status) {
      return $http.put(`${apiUrl}/headers/${aopId}/status`, { status: status }, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error updating AOP Header status:", error);
          throw error;
        });
    };

    this.getAopDetailsByAopId = function(aopId) {
      return $http.get(`${apiUrl}/details/by-aop/${aopId}/with-names`, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error getting AOP Details:", error);
          throw error;
        });
    };

    this.getAopDetail = function(aopDetailId) {
      return $http.get(`${apiUrl}/details/${aopDetailId}`, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error getting AOP Detail:", error);
          throw error;
        });
    };

    this.createAopDetail = function(aopDetailData) {
      return $http.post(`${apiUrl}/details`, aopDetailData, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error creating AOP Detail:", error);
          throw error;
        });
    };

    this.updateAopDetail = function(aopDetailId, aopDetailData) {
      return $http.put(`${apiUrl}/details/${aopDetailId}`, aopDetailData, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error updating AOP Detail:", error);
          throw error;
        });
    };

    this.deleteAopDetail = function(aopDetailId) {
      return $http.delete(`${apiUrl}/details/${aopDetailId}`, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error deleting AOP Detail:", error);
          throw error;
        });
    };

    this.getTotalAopDetailAmount = function(aopId) {
      return $http.get(`${apiUrl}/details/total-amount/${aopId}`, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error getting total AOP Detail amount:", error);
          throw error;
        });
    };
  }])
  .service('userService', ['$http', function($http) {
    const apiUrl = '/api/users';
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };

    this.getAllUsers = function() {
      return $http.get(apiUrl, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error fetching users:", error);
          throw error;
        });
    };

    this.getUser = function(ldap) {
      return $http.get(`${apiUrl}/${ldap}`, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error fetching user:", error);
          throw error;
        });
    };

    this.createUser = function(userData) {
      return $http.post(apiUrl, userData, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error creating user:", error);
          throw error;
        });
    };

    this.updateUser = function(ldap, userData) {
      return $http.put(`${apiUrl}/${ldap}`, userData, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error updating user:", error);
          throw error;
        });
    };

    this.deleteUser = function(ldap) {
      return $http.delete(`${apiUrl}/${ldap}`, config)
        .then(response => response.data)
        .catch(error => {
          console.error("Error deleting user:", error);
          throw error;
        });
    };
  }])
  .service('purchaseOrderService', ['$http', function($http) {
    const apiUrl = '/api/purchase-orders';
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };

    this.getAllPurchaseOrders = function() {
        return $http.get(apiUrl, config)
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching purchase orders:", error);
                throw error;
            });
    };

    this.getPurchaseOrder = function(poId) {
        return $http.get(`${apiUrl}/${poId}`, config)
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching purchase order:", error);
                throw error;
            });
    };

    this.getPurchaseOrdersByLdap = function(ldap) {
        // For now, return mock data since the backend isn't implemented
        return Promise.resolve([
            {
                po_id: 1,
                po_number: 'PO-2024-001',
                po_line_number: 1,
                requestor_ldap: ldap,
                budget_id: 1,
                purchase_item: 'Office Supplies',
                amount: 1500.00,
                po_date: new Date('2024-02-15')
            },
            {
                po_id: 2,
                po_number: 'PO-2024-002',
                po_line_number: 1,
                requestor_ldap: ldap,
                budget_id: 2,
                purchase_item: 'IT Equipment',
                amount: 5000.00,
                po_date: new Date('2024-02-16')
            }
        ]);
    };
  }])
  .service('costCenterService', ['$http', function($http) {
    const apiUrl = '/api/costcenters';
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
  }])
  .service('orgHierarchyService', ['$http', function($http) { //Add org hierarchy service
    const apiUrl = '/api/org-hierarchy';
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };

    this.createRelationship = function(relationshipData) {
      return $http.post(`${apiUrl}/relationships`, relationshipData, config)
        .then(response => response.data);
    };

    this.getAllRelationships = function() {
      return $http.get(`${apiUrl}/relationships`, config)
        .then(response => response.data);
    };

    this.getRelationshipById = function(relationshipId) {
      return $http.get(`${apiUrl}/relationships/${relationshipId}`, config)
        .then(response => response.data);
    };

    this.getRelationshipsByManager = function(managerLdap) {
      return $http.get(`${apiUrl}/relationships/manager/${managerLdap}`, config)
        .then(response => response.data);
    };

    this.getRelationshipsByEmployee = function(employeeLdap) {
      return $http.get(`${apiUrl}/relationships/employee/${employeeLdap}`, config)
        .then(response => response.data);
    };

    this.updateRelationship = function(relationshipId, relationshipData) {
      return $http.put(`${apiUrl}/relationships/${relationshipId}`, relationshipData, config)
        .then(response => response.data);
    };

    this.deleteRelationship = function(relationshipId) {
      return $http.delete(`${apiUrl}/relationships/${relationshipId}`, config)
        .then(response => response.data);
    };

    this.getHierarchyForManager = function(managerLdap) {
      return $http.get(`${apiUrl}/manager/${managerLdap}`, config)
        .then(response => response.data);
    };
  }]);
  