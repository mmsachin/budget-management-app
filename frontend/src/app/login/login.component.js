// frontend/src/app/login/login.component.js
"use strict";
angular.module('budgetApp')
    .component('login', {
        templateUrl: 'app/login/login.component.html',
        controller: ['$location', '$rootScope', '$timeout', function ($location, $rootScope, $timeout) {
            const ctrl = this;
            let loginTimeout;

            ctrl.formData = {
                password: ''
            };
            ctrl.loginError = '';
            ctrl.isLoading = false;


            ctrl.login = function () {
                ctrl.loginError = '';
                ctrl.isLoading = true;

                loginTimeout = $timeout(function () {
                    if (ctrl.formData.password === 'IKnowYou241202') {
                        $rootScope.isLoggedIn = true;
                        sessionStorage.setItem('isLoggedIn', 'true');
                        $location.path('/dashboard');
                    } else {
                        ctrl.loginError = 'Incorrect password. Please try again.';
                        $rootScope.isLoggedIn = false;
                        sessionStorage.removeItem('isLoggedIn');
                        ctrl.formData.password = '';
                    }
                    ctrl.isLoading = false;
                }, 500);
            };

            ctrl.$onInit = function () {
                if (sessionStorage.getItem('isLoggedIn') === 'true') {
                    $rootScope.isLoggedIn = true;
                    $location.path('/dashboard');
                }
            };

            ctrl.$onDestroy = function () {
                $timeout.cancel(loginTimeout); // Properly cancel the timeout
            };

            ctrl.isFormValid = function () {
                return ctrl.formData.password && ctrl.formData.password.length > 0;
            };
        }]
    });