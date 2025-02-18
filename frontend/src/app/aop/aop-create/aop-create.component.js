// frontend/src/app/aop/aop-create/aop-create.component.js
"use strict";

angular.module('budgetApp')
  .component('aopCreate', {
    templateUrl: 'app/aop/aop-create/aop-create.component.html',
    controller: ['aopService', '$routeParams', '$location', '$scope', 
      function(aopService, $routeParams, $location, $scope) {
        const ctrl = this;
        
        ctrl.aopHeader = {
          aop_name: '',
          total_amount: null,
          status: 'draft'
        };
        
        ctrl.aopId = $routeParams.aopId;
        ctrl.isEditMode = !!ctrl.aopId;
        ctrl.error = null;
        ctrl.saving = false;

        ctrl.$onInit = function() {
          if (ctrl.isEditMode) {
            ctrl.loadAopHeader();
          }
        };

        ctrl.loadAopHeader = function() {
          aopService.getAopHeader(ctrl.aopId)
            .then(header => {
              ctrl.aopHeader = header;
            })
            .catch(error => {
              ctrl.error = 'Failed to load AOP Header details.';
              console.error('Error loading AOP header:', error);
            });
        };

        ctrl.saveAopHeader = function() {
          ctrl.error = null;
          ctrl.saving = true;

          const savePromise = ctrl.isEditMode ?
            aopService.updateAopHeader(ctrl.aopId, ctrl.aopHeader) :
            aopService.createAopHeader(ctrl.aopHeader);

          savePromise
            .then(() => {
              $location.path('/aop-headers');
            })
            .catch(error => {
              ctrl.error = 'Failed to save AOP Header.';
              console.error('Error saving AOP header:', error);
            })
            .finally(() => {
              ctrl.saving = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        };

        ctrl.goBack = function() {
          $location.path('/aop-headers');
        };
      }
    ]
  });