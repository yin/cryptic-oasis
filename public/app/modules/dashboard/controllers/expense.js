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

    apiService.get('transactions', {filter:'expense'}).then(function(value) {
        vm.incomeHistory = value.result;
    })
}]);

