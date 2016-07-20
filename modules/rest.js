var express = require('express');
var _ = require('underscore');

var create_options = {
}
var list_options = {
	limit: 20,
	page: 1,
	orderBy: 'updatedAt DESC'
}

function handle_error(error) {
	// TODO yin: Add error mapping, for i18n and general UX and other RESTful funcs, like 404
	return res.json({ success: false, error: error.message });
}

module.exports = function(sequelize, type) {
	var router = express.Router();

	function create(req, res) {
		var results = [];
		var options = _.clone(create_options);
		_.extend(options, req.options || {});

		console.log(typeof(req.body), req.body);
		for ( var i in req.body) {
			console.log(i, req.body[i]);
		}

		type.build(req.body, options).save().then(function(completed) {
			return res.json({ success: true, result: completed });
		}).error(handle_error);
	}

	function list(req, res) {
		var results = [];
		var options = _.clone(list_options);

		_.extend(options, req.options || {});
		options.offset = (options.page - 1) * options.limit;

		type.findAll(options).then(function(results) {
			type.count().then(function(count) {
				return res.json({
					success: true,
					page: options.page,
					pageSize: options.limit,
					total: Math.ceil(count / options.limit),
					result: results
				});
			});
		}).catch(handle_error);
	}

	function count(req, res, next) {
		if (req.query && req.query.count) {
			type.count().then(function(result) {
				return res.json({ success: true, count: result });
			});
		} else {
			next();
		}
	}

	function pagination(req, res, next) {
		if (req.query && req.query.page) {
			req.options = req.options || {};
			req.options.page = Number(req.query.page);
		}
		next();
	}

	router.use(count);
	router.use(pagination);
	router.get('/', list);
	router.post('/', create);
	return router;
}
