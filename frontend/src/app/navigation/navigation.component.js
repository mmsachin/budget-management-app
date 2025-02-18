// frontend/src/app/navigation/navigation.component.js
angular.module('budgetApp')
  .component('navigationBar', {
    templateUrl: 'app/navigation/navigation.component.html',
    controller: ['$location', '$rootScope', function($location, $rootScope) {
      const ctrl = this;

      ctrl.username = $rootScope.username || 'User';

      ctrl.isActive = function(path) {
        return $location.path().startsWith(path); // Much simpler check
      };

      ctrl.logout = function() {
        $rootScope.isLoggedIn = false;
        sessionStorage.removeItem('isLoggedIn');
        $location.path('/login');
      };
    }]
  });