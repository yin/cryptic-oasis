var Sequelize = require('sequelize');

module.exports = function(sequelize, dataTypes) {
	var model = sequelize.define('expense', {
		amount: {
			// TODO yin: there are currencies, which use 4 decimal points 
			type: dataTypes.DECIMAL(12, 2),
			get: function() {
				return Number(this.getDataValue('amount'))
			}
		},
		// TODO yin: Implement portfolio table and reference it
	})
	model.findById(0).catch(function(err) {
		model.sync();
	})
	return model;
}
