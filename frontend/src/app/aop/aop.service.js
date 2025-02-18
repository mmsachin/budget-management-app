// frontend/src/app/aop/aop.service.js
angular.module('budgetApp')
  .service('aopService', ['$http', function($http) {
    const apiUrl = 'http://localhost:5000/aop'; // Base URL for AOP API

    // --- AOP Header Methods ---
    this.getAllAopHeaders = function() {
      return $http.get(`${apiUrl}/headers`)
        .then(response => response.data);
    };

    this.getAopHeader = function(aopId) {
      return $http.get(`${apiUrl}/headers/${aopId}`)
        .then(response => response.data);
    };

    this.createAopHeader = function(aopData) {
      return $http.post(`${apiUrl}/headers`, aopData)
        .then(response => response.data);
    };

    this.updateAopHeader = function(aopId, aopData) {
      return $http.put(`${apiUrl}/headers/${aopId}`, aopData)
        .then(response => response.data);
    };

    this.deleteAopHeader = function(aopId) {
      return $http.delete(`${apiUrl}/headers/${aopId}`)
        .then(response => response.data);
    };

    this.setAopHeaderStatus = function(aopId, status) {
        return $http.put(`${apiUrl}/headers/${aopId}/status`, { status: status })
          .then(response => response.data);
      };


    // --- AOP Detail Methods ---

    this.getAopDetailsByAopId = function(aopId) {
      return $http.get(`${apiUrl}/details/by-aop/${aopId}/with-names`)
        .then(response => response.data);
    };

    this.getAopDetail = function(aopDetailId) {
      return $http.get(`${apiUrl}/details/${aopDetailId}`)
        .then(response => response.data);
    };

    this.createAopDetail = function(aopDetailData) {
      return $http.post(`${apiUrl}/details`, aopDetailData)
        .then(response => response.data);
    };

    this.updateAopDetail = function(aopDetailId, aopDetailData) {
      return $http.put(`${apiUrl}/details/${aopDetailId}`, aopDetailData)
        .then(response => response.data);
    };

    this.deleteAopDetail = function(aopDetailId) {
      return $http.delete(`${apiUrl}/details/${aopDetailId}`)
        .then(response => response.data);
    };

    this.getTotalAopDetailAmount = function (aopId) {
        return $http.get(`${apiUrl}/details/total-amount/${aopId}`)
        .then(response => response.data);
    };
  }]);