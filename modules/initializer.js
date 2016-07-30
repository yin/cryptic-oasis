module.exports = {
	models: function (sequelize) {
		sequelize.sync();
	},
	stagging_data: function(Transaction) {
		Transaction.queryInterface.build({
			amount: 200,
			date: '2016-07-23T21:56:42.000Z'
		})
		.save()
		.then(function(completed) {
			console.log('Transaction created');
		}).error(function(error) {
			console.log('Transaction not created: ', error, error.message);
		});
	}
}
