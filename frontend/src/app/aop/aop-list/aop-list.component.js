// frontend/src/app/aop/aop-list/aop-list.component.js
"use strict";

angular.module('budgetApp')
  .component('aopList', {
    templateUrl: 'app/aop/aop-list/aop-list.component.html',
    controller: ['aopService', '$location', '$scope', function(aopService, $location, $scope) {
      const ctrl = this;
      ctrl.aopHeaders = [];
      ctrl.loading = true;
      ctrl.error = null;

      ctrl.$onInit = function() {
        ctrl.loadAopHeaders();
      };

      ctrl.loadAopHeaders = function() {
        ctrl.loading = true;
        ctrl.error = null;
        aopService.getAllAopHeaders()
          .then(headers => {
            ctrl.aopHeaders = headers;
          })
          .catch(error => {
            ctrl.error = "Failed to load AOP Headers. Please try again later.";
            console.error('Error loading AOP headers:', error);
          })
          .finally(() => {
            ctrl.loading = false;
            if (!$scope.$$phase) {
              $scope.$apply();
            }
          });
      };

      ctrl.goToCreateAopHeader = function() {
        $location.path('/aop-headers/create');
      };

      ctrl.editAopHeader = function(aopId) {
        $location.path(`/aop-headers/edit/${aopId}`);
      };

      ctrl.deleteAopHeader = function(aopId) {
        if (confirm('Are you sure you want to delete this AOP Header?')) {
          aopService.deleteAopHeader(aopId)
            .then(() => {
              ctrl.aopHeaders = ctrl.aopHeaders.filter(header => header.aop_id !== aopId);
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            })
            .catch(error => {
              console.error('Error deleting AOP header:', error);
              alert('Failed to delete AOP Header.');
            });
        }
      };

      ctrl.setAopStatus = function(aopId, status) {
        aopService.setAopHeaderStatus(aopId, status)
          .then(() => {
            ctrl.loadAopHeaders();
          })
          .catch(error => {
            console.error('Error setting AOP status:', error);
            alert(`Error setting status to ${status}`);
          });
      };
    }]
  });