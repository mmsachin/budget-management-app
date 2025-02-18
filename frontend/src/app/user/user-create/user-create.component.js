// frontend/src/app/user/user-create/user-create.component.js
angular.module('budgetApp')
  .component('userCreate', {
    templateUrl: 'app/user/user-create/user-create.component.html',
    controller: ['userService', 'costCenterService', '$routeParams', '$location', '$scope',
      function(userService, costCenterService, $routeParams, $location, $scope) {
        const ctrl = this;
        
        ctrl.user = {
          ldap: '',
          first_name: '',
          last_name: '',
          email: '',
          level: '',
          cost_center_code: ''
        };
        
        ctrl.costCenters = [];
        ctrl.ldap = $routeParams.ldap;
        ctrl.isEditMode = !!ctrl.ldap;
        ctrl.error = null;
        ctrl.saving = false;

        ctrl.$onInit = function() {
          loadCostCenters();
          if (ctrl.isEditMode) {
            loadUser();
          }
        };

        function loadCostCenters() {
          costCenterService.getAllCostCenters()
            .then(costCenters => {
              ctrl.costCenters = costCenters;
            })
            .catch(error => {
              console.error('Error loading cost centers:', error);
              ctrl.error = 'Failed to load cost centers.';
            });
        }

        function loadUser() {
          ctrl.loading = true;
          userService.getUser(ctrl.ldap)
            .then(user => {
              ctrl.user = user;
            })
            .catch(error => {
              ctrl.error = 'Failed to load user details.';
              console.error('Error loading user:', error);
            })
            .finally(() => {
              ctrl.loading = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        }

        ctrl.saveUser = function() {
          if (!isValid()) {
            return;
          }

          ctrl.error = null;
          ctrl.saving = true;

          const savePromise = ctrl.isEditMode ?
            userService.updateUser(ctrl.ldap, ctrl.user) :
            userService.createUser(ctrl.user);

          savePromise
            .then(() => {
              $location.path('/users');
            })
            .catch(error => {
              ctrl.error = error.data?.error || 'Failed to save user.';
              console.error('Error saving user:', error);
            })
            .finally(() => {
              ctrl.saving = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        };

        function isValid() {
          if (!ctrl.user.ldap || !ctrl.user.first_name || !ctrl.user.last_name || !ctrl.user.email) {
            ctrl.error = 'All required fields must be filled.';
            return false;
          }

          if (!isValidEmail(ctrl.user.email)) {
            ctrl.error = 'Please enter a valid email address.';
            return false;
          }

          return true;
        }

        function isValidEmail(email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        }

        ctrl.goBack = function() {
          $location.path('/users');
        };
      }
    ]
  });