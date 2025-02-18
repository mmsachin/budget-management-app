// frontend/src/app/app-routing.module.js
angular.module('budgetApp')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
      .when('/', {
        redirectTo: '/login'
      })
      .when('/login', {
        template: '<login></login>'
      })
      .when('/dashboard', {
        template: '<dashboard></dashboard>'
      })
      // Budget Routes
      .when('/budget-list', {
        template: '<budget-list></budget-list>'
      })
      .when('/budget-create', {
        template: '<budget-create></budget-create>'
      })
      .when('/budget-create/:budgetId', {
        template: '<budget-create></budget-create>'
      })
      // User Management Routes
      .when('/users', {
        template: '<user-list></user-list>'
      })
      .when('/users/create', {
        template: '<user-create></user-create>'
      })
      .when('/users/edit/:userId', {
        template: '<user-create></user-create>'
      })
	  // Cost Centers
	  .when('/cost-centers', {
	    template: '<cost-center-list></cost-center-list>'
	  })
	  .when('/cost-centers/create', {
	    template: '<cost-center-create></cost-center-create>'
	  })
	  .when('/cost-centers/edit/:costCenterCode', {
	    template: '<cost-center-create></cost-center-create>'
	  })
      // Organization Hierarchy Routes
      .when('/org-hierarchy', {
        template: '<org-hierarchy></org-hierarchy>'
      })
      .when('/org-hierarchy/create', { // Add org hierarchy routes
        template: '<org-hierarchy-create></org-hierarchy-create>'
      })
      .when('/org-hierarchy/edit/:relationshipId', {
        template: '<org-hierarchy-create></org-hierarchy-create>'
      })
      // AOP Routes
      .when('/aop-headers', {
        template: '<aop-list></aop-list>'
      })
      .when('/aop-headers/create', {
        template: '<aop-create></aop-create>'
      })
      .when('/aop-headers/edit/:aopId', {
        template: '<aop-create></aop-create>'
      })
      .when('/aop-details', {
        template: '<aop-detail-list></aop-detail-list>'
      })
      .when('/aop-details/create/:aopId', {
        template: '<aop-detail-create></aop-detail-create>'
      })
      .when('/aop-details/edit/:aopDetailId', {
        template: '<aop-detail-create></aop-detail-create>'
      })
      // Purchase Order Routes
      .when('/purchase-orders', {
        template: '<purchase-order-list></purchase-order-list>'
      })
      .when('/purchase-orders/create', {
        template: '<purchase-order-create></purchase-order-create>'
      })
      .when('/purchase-orders/edit/:poId', {
        template: '<purchase-order-create></purchase-order-create>'
      })
      // Report Routes
      .when('/reports/organization', {
        template: '<org-report></org-report>'
      })
      .when('/reports/budget', {
        template: '<budget-report></budget-report>'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }])
  .run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (next && next.$$route && next.$$route.originalPath !== '/login' && !$rootScope.isLoggedIn) {
        event.preventDefault();
        $location.path('/login');
      }
    });
  }]);