// frontend/src/app/cost-center/cost-center-list/cost-center-list.component.js
"use strict";

angular.module('budgetApp')
  .component('costCenterList', {
    templateUrl: 'app/cost-center/cost-center-list/cost-center-list.component.html',
    controller: ['costCenterService', '$location', '$scope',
      function(costCenterService, $location, $scope) {
        const ctrl = this;
        
        ctrl.costCenters = [];
        ctrl.filteredCostCenters = [];
        ctrl.loading = true;
        ctrl.error = null;
        ctrl.searchQuery = '';
        ctrl.sortField = 'cost_center_code';
        ctrl.sortReverse = false;

        ctrl.$onInit = function() {
          loadCostCenters();
        };

        function loadCostCenters() {
          ctrl.loading = true;
          ctrl.error = null;

          costCenterService.getAllCostCenters()
            .then(costCenters => {
              ctrl.costCenters = costCenters;
              ctrl.filterCostCenters();
            })
            .catch(error => {
              ctrl.error = "Failed to load cost centers. Please try again later.";
              console.error('Error loading cost centers:', error);
            })
            .finally(() => {
              ctrl.loading = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        }

        ctrl.filterCostCenters = function() {
          ctrl.filteredCostCenters = ctrl.costCenters.filter(costCenter => {
            const searchLower = ctrl.searchQuery.toLowerCase();
            return !ctrl.searchQuery ||
              costCenter.cost_center_code.toLowerCase().includes(searchLower) ||
              costCenter.cost_center_name.toLowerCase().includes(searchLower);
          });
          ctrl.sortCostCenters();
        };

        ctrl.sortCostCenters = function() {
          ctrl.filteredCostCenters.sort((a, b) => {
            let aVal = a[ctrl.sortField].toLowerCase();
            let bVal = b[ctrl.sortField].toLowerCase();
            return ctrl.sortReverse ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
          });
        };

        ctrl.sortBy = function(field) {
          if (ctrl.sortField === field) {
            ctrl.sortReverse = !ctrl.sortReverse;
          } else {
            ctrl.sortField = field;
            ctrl.sortReverse = false;
          }
          ctrl.sortCostCenters();
        };

        ctrl.goToCreateCostCenter = function() {
          $location.path('/cost-centers/create');
        };

        ctrl.editCostCenter = function(costCenterCode) {
          $location.path(`/cost-centers/edit/${costCenterCode}`);
        };

        ctrl.deleteCostCenter = function(costCenterCode) {
          if (confirm('Are you sure you want to delete this cost center?')) {
            costCenterService.deleteCostCenter(costCenterCode)
              .then(() => {
                ctrl.costCenters = ctrl.costCenters.filter(cc => cc.cost_center_code !== costCenterCode);
                ctrl.filterCostCenters();
              })
              .catch(error => {
                console.error('Error deleting cost center:', error);
                alert('Failed to delete cost center.');
              });
          }
        };
      }
    ]
  });