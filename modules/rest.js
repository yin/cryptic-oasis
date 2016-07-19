var express = require('express');


function psqlREST(psqlClient, table) {
	var router = express.Router();

	function create(psql) {
		var results = [];
		var query = psqlClient.query('SELECT * FROM $1 WHERE user=$2', [table, null]);
		query.on('row', function(row) {
			results.push(row);
		})
		query.on('end', function() {
			done();
			return res.json(results);
		})
	}

	function list(psql) {
		var results = [];
		var query = psqlClient.query('SELECT * FROM $1 WHERE user=$2', [table, null]);
		query.on('row', function(row) {
			results.push(row);
		})
		query.on('end', function() {
			done();
			return res.json(results);
		})
	}

	router.get('/', list);
	return router;
}

exports = {psqlREST}