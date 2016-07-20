var Sequelize = require('sequelize');

module.exports = function(url) {
	return new Sequelize(url, {
			native: true,
		 	dialect: "postgres"
		});
}
