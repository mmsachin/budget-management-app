// frontend/src/app/purchase-order/purchase-order-list/purchase-order-list.component.js
"use strict";

angular.module('budgetApp')
  .component('purchaseOrderList', {
    templateUrl: 'app/purchase-order/purchase-order-list/purchase-order-list.component.html',
    controller: ['purchaseOrderService', '$scope', function(purchaseOrderService, $scope) {
      const ctrl = this;
      
      ctrl.purchaseOrders = [];
      ctrl.filteredPOs = [];
      ctrl.loading = true;
      ctrl.error = null;
      ctrl.searchQuery = '';
      ctrl.dateRange = {
        start: null,
        end: null
      };
      ctrl.sortField = 'po_number';
      ctrl.sortReverse = false;
      ctrl.currentPage = 1;
      ctrl.pageSize = 10;

      ctrl.$onInit = function() {
        loadPurchaseOrders();
      };

      function loadPurchaseOrders() {
        ctrl.loading = true;
        ctrl.error = null;

        purchaseOrderService.getAllPurchaseOrders()
          .then(pos => {
            ctrl.purchaseOrders = pos;
            ctrl.filterPOs();
          })
          .catch(error => {
            ctrl.error = "Failed to load purchase orders. Please try again later.";
            console.error('Error loading purchase orders:', error);
          })
          .finally(() => {
            ctrl.loading = false;
            if (!$scope.$$phase) {
              $scope.$apply();
            }
          });
      }

      ctrl.filterPOs = function() {
        ctrl.filteredPOs = ctrl.purchaseOrders.filter(po => {
          const searchLower = ctrl.searchQuery.toLowerCase();
          const matchesSearch = !ctrl.searchQuery || 
            po.po_number.toLowerCase().includes(searchLower) ||
            po.purchase_item.toLowerCase().includes(searchLower) ||
            po.requestor_ldap.toLowerCase().includes(searchLower);

          const poDate = new Date(po.po_date);
          const matchesDateRange = (!ctrl.dateRange.start || poDate >= new Date(ctrl.dateRange.start)) &&
            (!ctrl.dateRange.end || poDate <= new Date(ctrl.dateRange.end));

          return matchesSearch && matchesDateRange;
        });

        ctrl.sortPOs();
      };

      ctrl.sortPOs = function() {
        ctrl.filteredPOs.sort((a, b) => {
          let aVal = a[ctrl.sortField];
          let bVal = b[ctrl.sortField];

          if (ctrl.sortField === 'po_date') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
          } else if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }

          if (aVal < bVal) return ctrl.sortReverse ? 1 : -1;
          if (aVal > bVal) return ctrl.sortReverse ? -1 : 1;
          return 0;
        });
      };

      ctrl.sortBy = function(field) {
        if (ctrl.sortField === field) {
          ctrl.sortReverse = !ctrl.sortReverse;
        } else {
          ctrl.sortField = field;
          ctrl.sortReverse = false;
        }
        ctrl.sortPOs();
      };

      ctrl.getPaginatedPOs = function() {
        const startIndex = (ctrl.currentPage - 1) * ctrl.pageSize;
        return ctrl.filteredPOs.slice(startIndex, startIndex + ctrl.pageSize);
      };
    }]
  });