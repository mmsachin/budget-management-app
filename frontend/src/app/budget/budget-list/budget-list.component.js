// frontend/src/app/budget/budget-list/budget-list.component.js
"use strict";
angular.module('budgetApp')
  .component('budgetList', {
    templateUrl: 'app/budget/budget-list/budget-list.component.html',
    controller: ['budgetService', '$location', '$scope', function(budgetService, $location, $scope) {
      const ctrl = this;

      ctrl.budgets = [];
      ctrl.filteredBudgets = [];
      ctrl.loading = true;
      ctrl.error = null;
      ctrl.searchQuery = '';
      ctrl.selectedAop = '';
      ctrl.minAmount = null;
      ctrl.maxAmount = null;
      ctrl.sortField = 'project';
      ctrl.sortReverse = false;
      ctrl.currentPage = 1;
      ctrl.pageSize = 10;
      ctrl.uniqueAops = [];

      ctrl.$onInit = function() {
        loadBudgets();
      };

      function loadBudgets() {
        ctrl.loading = true;
        ctrl.error = null;

        budgetService.getAllBudgets()
          .then(function(budgets) {
            ctrl.budgets = budgets;
            ctrl.uniqueAops = [...new Set(budgets.map(b => b.aop_id))].filter(Boolean);
            ctrl.filterBudgets();
          })
          .catch(function(error) {
            ctrl.error = "Failed to load budgets. Please try again later.";
            console.error('Error loading budgets:', error);
          })
          .finally(function() {
            ctrl.loading = false;
             // $scope.$apply(); // Removed
          });
      }

      ctrl.filterBudgets = function() {
        ctrl.filteredBudgets = ctrl.budgets.filter(budget => {
          const matchesSearch = !ctrl.searchQuery ||
            budget.project.toLowerCase().includes(ctrl.searchQuery.toLowerCase()) ||
            budget.description.toLowerCase().includes(ctrl.searchQuery.toLowerCase());
          
          const matchesAop = !ctrl.selectedAop ||
            budget.aop_id === ctrl.selectedAop;

          const matchesAmount = (!ctrl.minAmount || budget.amount >= ctrl.minAmount) &&
            (!ctrl.maxAmount || budget.amount <= ctrl.maxAmount);

          return matchesSearch && matchesAop && matchesAmount;
        });

        ctrl.sortBudgets();
        ctrl.currentPage = 1;
      };

      ctrl.sortBudgets = function() {
        ctrl.filteredBudgets.sort((a, b) => {
          let aVal = a[ctrl.sortField];
          let bVal = b[ctrl.sortField];

          if (typeof aVal === 'string') {
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
        ctrl.sortBudgets();
      };

      ctrl.goToCreateBudget = function() {
        $location.path('/budget-create');
         // $scope.$apply(); // Removed
      };

      ctrl.editBudget = function(budgetId) {
        $location.path('/budget-create/' + budgetId);
         // $scope.$apply(); // Removed
      };

      ctrl.deleteBudget = function(budgetId) {
        if (confirm('Are you sure you want to delete this budget?')) {
          budgetService.deleteBudget(budgetId)
            .then(function() {
              ctrl.budgets = ctrl.budgets.filter(budget => budget.budget_id !== budgetId);
              ctrl.filterBudgets();
               // $scope.$apply(); // Removed
            })
            .catch(function(error) {
              console.error('Error deleting budget:', error);
              alert('Failed to delete budget.');
            });
        }
      };
    }]
  });