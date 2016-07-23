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
    vm.expenseHistory = [

    ];

    apiService.get('transactions', {filters:'expense'}).then(function(value) {
        vm.expenseHistory = _.map(value.result, function(item) {
            item.amount = -Number(item.amount);
            return item;
        });
    })
}]);

