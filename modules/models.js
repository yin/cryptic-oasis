var sequelize = require('sequelize');

exports {
	income: sequelize.define('income', {
		amount: {
			// TODO yin: there are currencies, which use 4 decimal points 
			type: Sequelize.DECIMAL(12, 2);
		},
		// TODO yin: Implement portfolio table and reference it
	})
}
