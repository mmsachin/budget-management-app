// frontend/src/app/dashboard/dashboard.component.js
"use strict";
angular.module('budgetApp')
  .component('dashboard', {
    templateUrl: 'app/dashboard/dashboard.component.html',
    controller: ['$location', '$rootScope', 'aopService', 'budgetService', 'purchaseOrderService', '$scope',
      function($location, $rootScope, aopService, budgetService, purchaseOrderService, $scope) {
        const ctrl = this;

        ctrl.username = $rootScope.username || 'User';
        ctrl.currentDate = new Date();
        ctrl.activeAop = null;
        ctrl.pendingRequests = [];
        ctrl.recentPOs = [];
        ctrl.loading = {
          aop: false,
          pos: false,
          requests: false
        };

        ctrl.$onInit = function() {
          if (!$rootScope.isLoggedIn) {
            $location.path('/login');
            return;
          }

          loadDashboardData();
        };

        function loadDashboardData() {
          // Load Active AOP
          ctrl.loading.aop = true;
          aopService.getAllAopHeaders()
            .then(headers => {
              ctrl.activeAop = headers.find(h => h.status === 'active');
            })
            .catch(error => {
              console.error('Error loading active AOP:', error);
            })
            .finally(() => {
              ctrl.loading.aop = false;
              if (!$scope.$$phase) {  // Put back for navigation
                $scope.$apply();
              }
            });

          // Load recent purchase orders
          ctrl.loading.pos = true;
          purchaseOrderService.getAllPurchaseOrders()
            .then(pos => {
              // Sort by date (descending) and take most recent 5
              ctrl.recentPOs = pos
                .sort((a, b) => new Date(b.po_date) - new Date(a.po_date))
                .slice(0, 5);
            })
            .catch(error => {
              console.error('Error loading purchase orders:', error);
            })
            .finally(() => {
              ctrl.loading.pos = false;
              if (!$scope.$$phase) { // Put back for navigation
                $scope.$apply();
              }
            });

        // Load Budget request
        ctrl.loading.requests = true;

        budgetService.getAllBudgets()  // Fetch all budgets
            .then(budgets => {
                ctrl.pendingRequests = budgets.slice(0,5);  // put them in pendingRequests
                ctrl.loading.requests = false;
                 if (!$scope.$$phase) { // Put back for navigation
                    $scope.$apply();
                 }
            })
            .catch(error => {
                console.error('Error loading budgets for dashboard:', error);
                ctrl.loading.requests = false;
                if (!$scope.$$phase) { // Put back for navigation
                    $scope.$apply();
                }
            });
        }

        // Navigation functions
        ctrl.goToBudgetList = function() {
          $location.path('/budget-list');
          if (!$scope.$$phase) { // Put back for navigation
                $scope.$apply();
          }
        };

        ctrl.goToCreateBudget = function() {
          $location.path('/budget-create');
            if (!$scope.$$phase) { // Put back for navigation
                $scope.$apply();
            }
        };

        ctrl.goToCostCenters = function() {
          $location.path('/cost-centers');
            if (!$scope.$$phase) { // Put back for navigation
                $scope.$apply();
            }
        };

        ctrl.goToAopHeaders = function() {
          $location.path('/aop-headers');
           if (!$scope.$$phase) { // Put back for navigation
                $scope.$apply();
            }
        };

        ctrl.goToPurchaseOrders = function() {
          $location.path('/purchase-orders');
            if (!$scope.$$phase) { // Put back for navigation
                $scope.$apply();
            }
        };

		ctrl.goToOrgHierarchy = function() {
			$location.path('/org-hierarchy');
            if (!$scope.$$phase) { // Put back for navigation
                $scope.$apply();
            }
		};

		ctrl.goToCreateOrgHierarchy = function() {
			$location.path('/org-hierarchy/create');
            if (!$scope.$$phase) { // Put back for navigation
                $scope.$apply();
            }
		};
		
        ctrl.goToReports = function(type) {
          $location.path('/reports/' + type);
            if (!$scope.$$phase) { // Put back for navigation
                $scope.$apply();
            }
        };
      }
    ]
  });