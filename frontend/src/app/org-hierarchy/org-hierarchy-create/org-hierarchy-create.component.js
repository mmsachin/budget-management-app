// frontend/src/app/org-hierarchy/org-hierarchy-create/org-hierarchy-create.component.js
"use strict";

angular.module('budgetApp')
  .component('orgHierarchyCreate', {
    templateUrl: 'app/org-hierarchy/org-hierarchy-create/org-hierarchy-create.component.html',
    controller: ['orgHierarchyService', 'userService', '$routeParams', '$location', '$scope',
      function(orgHierarchyService, userService, $routeParams, $location, $scope) {
        const ctrl = this;

        ctrl.relationship = {
          manager_ldap: '',
          employee_ldap: ''
        };

        ctrl.relationshipId = $routeParams.relationshipId;
        ctrl.isEditMode = !!ctrl.relationshipId;
        ctrl.error = null;
        ctrl.saving = false;
        ctrl.users = [];
        ctrl.loadingUsers = true;

        ctrl.$onInit = function() {
           ctrl.loadUsers();
          if (ctrl.isEditMode) {
            ctrl.loadRelationship();
          }
        };

        ctrl.loadUsers = function() {
          ctrl.loadingUsers = true;
          userService.getAllUsers()
            .then(users => {
              ctrl.users = users;
            })
            .catch(error => {
              ctrl.error = 'Failed to load users.';
              console.error('Error loading users:', error);
            })
             .finally(() => {
              ctrl.loadingUsers = false;
              // if (!$scope.$$phase) {  <-- REMOVE
              //   $scope.$apply();
              // }
            });
        };

        ctrl.loadRelationship = function() {
          orgHierarchyService.getRelationshipById(ctrl.relationshipId)
            .then(relationship => {
              ctrl.relationship = relationship;
            })
            .catch(error => {
              ctrl.error = 'Failed to load relationship details.';
              console.error('Error loading relationship:', error);
            });
        };

        ctrl.saveRelationship = function() {
          ctrl.error = null;
          ctrl.saving = true;

          if (ctrl.relationship.manager_ldap === ctrl.relationship.employee_ldap) {
            ctrl.error = 'Manager and employee cannot be the same.';
            ctrl.saving = false;
            return;
          }

          const savePromise = ctrl.isEditMode ?
            orgHierarchyService.updateRelationship(ctrl.relationshipId, ctrl.relationship) :
            orgHierarchyService.createRelationship(ctrl.relationship);

          savePromise
            .then(() => {
              $location.path('/org-hierarchy');
            })
            .catch(error => {
              ctrl.error = 'Failed to save relationship.';
              console.error('Error saving relationship:', error);
            })
            .finally(() => {
              ctrl.saving = false;
              // if (!$scope.$$phase) {  <-- REMOVE
              //   $scope.$apply();
              // }
            });
        };

        ctrl.goBack = function() {
          $location.path('/org-hierarchy');
        };
      }
    ]
  });