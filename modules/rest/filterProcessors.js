var _ = require('underscore');

module.exports = {
	transactions: function(filters) {
		console.log("tr.filProc:", filters, _.contains(filters, 'all'))
		if (_.isEmpty(filters)) {
			return 'unscheduled';
		} else if(_.contains(filters, 'all')) {
			return null;
		} else {
			return filters;
		}
	}
}
