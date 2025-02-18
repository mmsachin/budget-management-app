// frontend/src/app/budget/budget-create/budget-create.component.js
"use strict";
angular.module('budgetApp')
    .component('budgetCreate', {
        templateUrl: 'app/budget/budget-create/budget-create.component.html',
        controller: ['budgetService', '$routeParams', '$location', '$scope',
            function (budgetService, $routeParams, $location, $scope) {
                const ctrl = this;

                ctrl.budget = {
                    project: '',
                    description: '',
                    amount: null,
                    ldap: '',
                    aop_id: ''
                };
                ctrl.budgetId = $routeParams.budgetId;
                ctrl.isEditMode = !!ctrl.budgetId;
                ctrl.error = null;
                ctrl.saving = false;

                ctrl.$onInit = function () {
                    if (ctrl.isEditMode) {
                        loadBudget();
                    }
                };

                function loadBudget() {
                    ctrl.loading = true;
                    budgetService.getBudget(ctrl.budgetId)
                        .then(budget => {
                            ctrl.budget = budget;
                            // $scope.$apply(); // Removed
                        })
                        .catch(error => {
                            ctrl.error = 'Failed to load budget details. Please try again.';
                            console.error('Error loading budget:', error);
                            // $scope.$apply(); // Removed
                        })
                        .finally(() => {
                            ctrl.loading = false;
                            // $scope.$apply(); // Removed
                        });
                }

                ctrl.saveBudget = function () {
                    ctrl.error = null;
                    ctrl.saving = true;

                    const savePromise = ctrl.isEditMode ?
                        budgetService.updateBudget(ctrl.budgetId, ctrl.budget) :
                        budgetService.createBudget(ctrl.budget);

                    savePromise
                        .then(() => {
                            $location.path('/budget-list');
                            // $scope.$apply(); // Removed
                        })
                        .catch(error => {
                            ctrl.error = 'Failed to save budget. Please check all required fields and try again.';
                            console.error('Error saving budget:', error);
                            //  $scope.$apply(); // Removed
                        })
                        .finally(() => {
                            ctrl.saving = false;
                            //  $scope.$apply(); // Removed
                        });
                };

                ctrl.goBack = function() {
                    console.log('Going back to budget list');
                    $location.path('/budget-list');
                    // $scope.$apply(); // Removed
                };
            }
        ]
    });