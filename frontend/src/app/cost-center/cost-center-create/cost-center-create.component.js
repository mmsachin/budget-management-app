// frontend/src/app/cost-center/cost-center-create/cost-center-create.component.js
"use strict";

angular.module('budgetApp')
  .component('costCenterCreate', {
    templateUrl: 'app/cost-center/cost-center-create/cost-center-create.component.html',
    controller: ['costCenterService', '$routeParams', '$location', '$scope',
      function(costCenterService, $routeParams, $location, $scope) {
        const ctrl = this;
        
        ctrl.costCenter = {
          cost_center_code: '',
          cost_center_name: ''
        };
        
        ctrl.costCenterCode = $routeParams.costCenterCode;
        ctrl.isEditMode = !!ctrl.costCenterCode;
        ctrl.error = null;
        ctrl.saving = false;

        ctrl.$onInit = function() {
          if (ctrl.isEditMode) {
            loadCostCenter();
          }
        };

        function loadCostCenter() {
          ctrl.loading = true;
          costCenterService.getCostCenter(ctrl.costCenterCode)
            .then(costCenter => {
              ctrl.costCenter = costCenter;
            })
            .catch(error => {
              ctrl.error = 'Failed to load cost center details.';
              console.error('Error loading cost center:', error);
            })
            .finally(() => {
              ctrl.loading = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        }

        ctrl.saveCostCenter = function() {
          if (!isValid()) {
            return;
          }

          ctrl.error = null;
          ctrl.saving = true;

          const savePromise = ctrl.isEditMode ?
            costCenterService.updateCostCenter(ctrl.costCenterCode, ctrl.costCenter) :
            costCenterService.createCostCenter(ctrl.costCenter);

          savePromise
            .then(() => {
              $location.path('/cost-centers');
            })
            .catch(error => {
              ctrl.error = error.data?.error || 'Failed to save cost center.';
              console.error('Error saving cost center:', error);
            })
            .finally(() => {
              ctrl.saving = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        };

        function isValid() {
          // Basic validation
          if (!ctrl.costCenter.cost_center_code || !ctrl.costCenter.cost_center_name) {
            ctrl.error = 'All fields are required.';
            return false;
          }

          // Code validation
          if (!/^[a-zA-Z0-9]+$/.test(ctrl.costCenter.cost_center_code)) {
            ctrl.error = 'Cost center code must be alphanumeric.';
            return false;
          }

          if (ctrl.costCenter.cost_center_code.length > 50) {
            ctrl.error = 'Cost center code cannot exceed 50 characters.';
            return false;
          }

          // Name validation
          if (ctrl.costCenter.cost_center_name.length > 255) {
            ctrl.error = 'Cost center name cannot exceed 255 characters.';
            return false;
          }

          return true;
        }

        ctrl.goBack = function() {
          $location.path('/cost-centers');
        };
      }
    ]
  });