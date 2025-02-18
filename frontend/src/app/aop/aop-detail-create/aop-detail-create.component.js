// frontend/src/app/aop/aop-detail-create/aop-detail-create.component.js
"use strict";

angular.module('budgetApp')
  .component('aopDetailCreate', {
    templateUrl: 'app/aop/aop-detail-create/aop-detail-create.component.html',
    controller: ['aopService', 'costCenterService', '$routeParams', '$location', '$scope',
      function(aopService, costCenterService, $routeParams, $location, $scope) {
        const ctrl = this;
        
        ctrl.aopDetail = {
          aop_id: $routeParams.aopId || '',
          cost_center_code: '',
          amount: null
        };
        
        ctrl.aopDetailId = $routeParams.aopDetailId;
        ctrl.isEditMode = !!ctrl.aopDetailId;
        ctrl.costCenters = [];
        ctrl.loadingCostCenters = true;
        ctrl.error = null;
        ctrl.saving = false;

        ctrl.$onInit = function() {
          ctrl.loadCostCenters();
          if (ctrl.isEditMode) {
            ctrl.loadAopDetail();
          }
        };

        ctrl.loadCostCenters = function() {
          ctrl.loadingCostCenters = true;
          costCenterService.getAllCostCenters()
            .then(costCenters => {
              ctrl.costCenters = costCenters;
            })
            .catch(error => {
              ctrl.error = 'Failed to load cost centers.';
              console.error('Error loading cost centers:', error);
            })
            .finally(() => {
              ctrl.loadingCostCenters = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        };

        ctrl.loadAopDetail = function() {
          aopService.getAopDetail(ctrl.aopDetailId)
            .then(detail => {
              ctrl.aopDetail = detail;
            })
            .catch(error => {
              ctrl.error = 'Failed to load AOP Detail details.';
              console.error('Error loading AOP detail:', error);
            });
        };

        ctrl.saveAopDetail = function() {
          ctrl.error = null;
          ctrl.saving = true;

          const savePromise = ctrl.isEditMode ?
            aopService.updateAopDetail(ctrl.aopDetailId, ctrl.aopDetail) :
            aopService.createAopDetail(ctrl.aopDetail);

          savePromise
            .then(() => {
              $location.path('/aop-details');
            })
            .catch(error => {
              ctrl.error = 'Failed to save AOP Detail.';
              console.error('Error saving AOP detail:', error);
            })
            .finally(() => {
              ctrl.saving = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        };

        ctrl.goBack = function() {
          $location.path('/aop-details');
        };
      }
    ]
  });