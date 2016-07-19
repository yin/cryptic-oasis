var express = require('express');

var create_options = {
}
var list_options = {
	limit: 20,
	orderBy: 'updatedAt DESC'
}

function sequelize_rest(type) {
	var router = express.Router();

	function create(req, res) {
		var results = [];
		var options = _.clone(create_options);
		_.extend(options, req.options || {});

		type.upsert(req.body).then(function() {

		}).catch(function(error) {
			// TODO yin: Add error mapping, for i18n and general UX and other RESTful funcs, like 404
			return res.json({ success: false, error: error.message });
		});
	}

	function list(req, res) {
		var results = [];
		var options = _.clone(list_options);
		_.extend(options, req.options || {});

		type.findAll(options).then(function(results) {
			return res.json(results);
		});
	}

	function count(req, res) {
		type.count().then(function(result) {
			res.json({ count: result });
		});
	}

	function paggination(req, res, next, page) {
		req.options || req.options = {};
		req.options.offset = req.page * list_options.limit;
		next();
	}

	router.param('count', count);
	router.param('page', pagination);
	router.get('/', list);
	return router;
}

exports = { sequelize_rest }