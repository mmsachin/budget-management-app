// frontend/src/app/aop/aop-detail-list/aop-detail-list.component.js
"use strict";

angular.module('budgetApp')
  .component('aopDetailList', {
    templateUrl: 'app/aop/aop-detail-list/aop-detail-list.component.html',
    controller: ['aopService', 'costCenterService', '$location', '$scope',
      function(aopService, costCenterService, $location, $scope) {
        const ctrl = this;
        ctrl.aopHeaders = [];
        ctrl.aopDetails = [];
        ctrl.selectedAopId = '';
        ctrl.loading = false;
        ctrl.loadingHeaders = true;
        ctrl.error = null;
        ctrl.totalDetailAmount = 0;

        ctrl.$onInit = function() {
          ctrl.loadAopHeaders();
        };

        ctrl.loadAopHeaders = function() {
          ctrl.loadingHeaders = true;
          aopService.getAllAopHeaders()
            .then(headers => {
              ctrl.aopHeaders = headers;
            })
            .catch(error => {
              ctrl.error = "Failed to load AOP Headers.";
              console.error('Error loading AOP headers:', error);
            })
            .finally(() => {
              ctrl.loadingHeaders = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        };

        ctrl.loadAopDetails = function() {
          if (!ctrl.selectedAopId) {
            ctrl.aopDetails = [];
            ctrl.totalDetailAmount = 0;
            return;
          }

          ctrl.loading = true;
          ctrl.error = null;

          Promise.all([
            aopService.getAopDetailsByAopId(ctrl.selectedAopId),
            aopService.getTotalAopDetailAmount(ctrl.selectedAopId)
          ])
            .then(([details, totalAmount]) => {
              ctrl.aopDetails = details;
              ctrl.totalDetailAmount = totalAmount.total_amount;
            })
            .catch(error => {
              ctrl.error = "Failed to load AOP Details.";
              console.error('Error loading AOP details:', error);
            })
            .finally(() => {
              ctrl.loading = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        };

        ctrl.goToCreateAopDetail = function() {
          $location.path(`/aop-details/create/${ctrl.selectedAopId}`);
        };

        ctrl.editAopDetail = function(aopDetailId) {
          $location.path(`/aop-details/edit/${aopDetailId}`);
        };

        ctrl.deleteAopDetail = function(aopDetailId) {
          if (confirm('Are you sure you want to delete this AOP Detail?')) {
            aopService.deleteAopDetail(aopDetailId)
              .then(() => {
                ctrl.aopDetails = ctrl.aopDetails.filter(detail => detail.aop_detail_id !== aopDetailId);
                ctrl.loadAopDetails();
              })
              .catch(error => {
                console.error('Error deleting AOP detail:', error);
                alert('Failed to delete AOP Detail.');
              });
          }
        };
      }
    ]
  });