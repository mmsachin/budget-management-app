// frontend/src/app/app.component.js
angular.module('budgetApp')
  .component('appRoot', {
    templateUrl: 'app/app.component.html',
    controller: function() {
      this.message = 'Hello from Sachin!';
    }
  });