// frontend/src/app/org-hierarchy/org-hierarchy.component.js
"use strict";

angular.module('budgetApp')
  .component('orgHierarchy', {
    templateUrl: 'app/org-hierarchy/org-hierarchy.component.html',
    controller: ['orgHierarchyService', 'userService', '$location', '$scope', '$q',
      function(orgHierarchyService, userService, $location, $scope, $q) {
        const ctrl = this;
        ctrl.relationships = [];
        ctrl.hierarchy = [];
        ctrl.selectedManager = '';
        ctrl.loading = false;
        ctrl.error = null;
        ctrl.users = [];
        ctrl.loadingUsers = true;


        ctrl.$onInit = function() {
            ctrl.loadUsers();
            ctrl.loadRelationships(); //Load relationships initially
        };

        ctrl.loadHierarchy = function() {
            ctrl.loading = true;
            ctrl.error = null;
            ctrl.hierarchy = []; // Clear previous hierarchy

            if (ctrl.selectedManager) {
                orgHierarchyService.getHierarchyForManager(ctrl.selectedManager)
                .then(hierarchy => {
                    ctrl.hierarchy = hierarchy;
                })
                .catch(error => {
                    ctrl.error = "Failed to load hierarchy.";
                    console.error('Error loading hierarchy:', error);
                })
                .finally(() => {
                    ctrl.loading = false;
                    // $scope.$apply(); //Safe apply  <-- REMOVE THIS
                });
            } else {
                ctrl.loading = false; //No manager selected, so not loading.
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
              // if (!$scope.$$phase) {   <-- REMOVE THIS
              //   $scope.$apply();
              // }
            });
        };


        ctrl.goToCreateRelationship = function() {
          $location.path('/org-hierarchy/create');
        };

        ctrl.editRelationship = function(relationshipId) {
          $location.path(`/org-hierarchy/edit/${relationshipId}`);
        };

        ctrl.deleteRelationship = function(relationshipId) {
          if (confirm('Are you sure you want to delete this relationship?')) {
            orgHierarchyService.deleteRelationship(relationshipId)
              .then(() => {
                ctrl.relationships = ctrl.relationships.filter(rel => rel.relationship_id !== relationshipId);
                //  if (!$scope.$$phase) {     <-- REMOVE THIS
                //     $scope.$apply(); // or $scope.$digest();
                //   }
              })
              .catch(error => {
                console.error('Error deleting relationship:', error);
                alert('Failed to delete relationship.');
              });
          }
        };
        ctrl.loadRelationships = function () {
            ctrl.loading = true;
            ctrl.error = null;

            orgHierarchyService.getAllRelationships()
            .then(relationships => {
                ctrl.relationships = relationships;
                })
            .catch(error => {
                ctrl.error = "Failed to load relationships.";
                console.error('Error loading relationships', error);
                })
            .finally(() => {
                ctrl.loading = false;
                // if (!$scope.$$phase) {  <-- REMOVE THIS
                //     $scope.$apply();
                // }
            });
        };
      }
    ]
  });