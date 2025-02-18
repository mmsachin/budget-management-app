// frontend/src/app/user/user-list/user-list.component.js
angular.module('budgetApp')
  .component('userList', {
    templateUrl: 'app/user/user-list/user-list.component.html',
    controller: ['userService', 'costCenterService', '$location', '$scope',
      function(userService, costCenterService, $location, $scope) {
        const ctrl = this;

        ctrl.users = [];
        ctrl.filteredUsers = [];
        ctrl.costCenters = [];
        ctrl.loading = true;
        ctrl.error = null;
        ctrl.searchQuery = '';
        ctrl.selectedCostCenter = '';
        ctrl.sortField = 'ldap';
        ctrl.sortReverse = false;
        ctrl.currentPage = 1;
        ctrl.pageSize = 10;

        ctrl.$onInit = function() {
          loadCostCenters();
          loadUsers();
        };

        function loadCostCenters() {
          costCenterService.getAllCostCenters()
            .then(costCenters => {
              ctrl.costCenters = costCenters;
            })
            .catch(error => {
              console.error('Error loading cost centers:', error);
            });
        }

        function loadUsers() {
          ctrl.loading = true;
          ctrl.error = null;

          userService.getAllUsers()
            .then(users => {
              ctrl.users = users;
              ctrl.filterUsers();
            })
            .catch(error => {
              ctrl.error = "Failed to load users. Please try again later.";
              console.error('Error loading users:', error);
            })
            .finally(() => {
              ctrl.loading = false;
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            });
        }

        ctrl.filterUsers = function() {
          ctrl.filteredUsers = ctrl.users.filter(user => {
            const searchLower = ctrl.searchQuery.toLowerCase();
            const matchesSearch = !ctrl.searchQuery ||
              user.ldap.toLowerCase().includes(searchLower) ||
              user.first_name.toLowerCase().includes(searchLower) ||
              user.last_name.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower);

            const matchesCostCenter = !ctrl.selectedCostCenter ||
              user.cost_center_code === ctrl.selectedCostCenter;

            return matchesSearch && matchesCostCenter;
          });

          ctrl.sortUsers();
          ctrl.currentPage = 1;
        };

        ctrl.sortUsers = function() {
          ctrl.filteredUsers.sort((a, b) => {
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
          ctrl.sortUsers();
        };

        ctrl.goToCreateUser = function() {
          $location.path('/users/create');
        };

        ctrl.editUser = function(ldap) {
          $location.path(`/users/edit/${ldap}`);
        };

        ctrl.deleteUser = function(ldap) {
          if (confirm('Are you sure you want to delete this user?')) {
            userService.deleteUser(ldap)
              .then(() => {
                ctrl.users = ctrl.users.filter(user => user.ldap !== ldap);
                ctrl.filterUsers();
              })
              .catch(error => {
                console.error('Error deleting user:', error);
                alert('Failed to delete user.');
              });
          }
        };

        ctrl.getPaginatedUsers = function() {
          const startIndex = (ctrl.currentPage - 1) * ctrl.pageSize;
          return ctrl.filteredUsers.slice(startIndex, startIndex + ctrl.pageSize);
        };
      }
    ]
  });