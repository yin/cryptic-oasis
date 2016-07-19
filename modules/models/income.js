module.exports = function(sequelize) {
	return sequelize.define('income', {
		amount: {
			// TODO yin: there are currencies, which use 4 decimal points 
			type: sequelize.DECIMAL(12, 2)
		},
		// TODO yin: Implement portfolio table and reference it
	})
}
