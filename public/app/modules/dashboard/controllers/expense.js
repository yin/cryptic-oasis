/**
 * Controller for Expense page
 */

dashboard.controller("ExpenseController", ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', 'apiService',
function ($rootScope, $scope, $state, $location, dashboardService, Flash, apiService) {
    var vm = this;
    vm.meMarks = false;
    vm.mscMarks = false;
    vm.hscMarks = false;
    vm.sslcMarks = false;
    vm.incomeHistory = [

    ];

    apiService.get('expense', {page:1}).then(function(value) {
        console.log("expense-result", value);
        vm.incomeHistory = value.result;
    })
}]);

