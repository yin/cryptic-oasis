/**
 * Express.js router for a RESTful web service backed by Sequelize.
 */
var express = require('express');
var _ = require('underscore');

var create_options = {
}
var list_options = {
	limit: 20,
	page: 1,
	orderBy: 'updatedAt DESC'
}

function param(req, paramName, filter, def) {
	if (req.query && req.query[paramName]) {
		if(filter) {
			return filter(req.query[paramName]);
		} else {
			return req.query[paramName];
		}
	}
	return def;
}

function handle_error(res, status, error) {
	console.error(error);
	var status = status || 404;
	// TODO yin: Add error mapping, for i18n and general UX and other RESTful funcs, like 404
	return res.status(status).json({ success: false, error: error.message });
}
function error_handler(res, status) {
	return function(error) {
		return handle_error(res, status, error)
	}
}

function handle_success(res, responseBase, responseResult) {
	var result = _.extend(responseBase, responseResult);
	return res.json(result);
}

module.exports = function(sequelize, type, options) {
	options = options || {};
	var router = express.Router();
	var filterProcessor = options.filterProcessor;


	function create(req, res) {
		req.queryInterface.build(req.body, req.queryOptions)
			.save()
			.then(function(completed) {
				return handle_success(res, {}, {
					success: true,
					result: completed
				});
			}).error(error_handler(res));
	}

	function list(req, res) {
		req.queryInterface.findAll(req.queryOptions)
			.then(function(results) {
				handle_success(res, req.responseBase, {
					success: true,
					result: results
				});
			}).catch(error_handler(res));
	}

	function update(req, res) {
		console.log("rest.update:" + req.params.id)
		req.queryInterface.findOne(req.queryOptions)
			.then(function(results) {
				return handle_success(res, req.responseBase,
					{success: false, error: "Operation not implemented"}
				);
			}).catch(error_handler(res));
	}

	function remove(req, res) {
		console.log("rest.delete:" + req.params.id)
		req.queryInterface.findOne(req.queryOptions)
			.then(function(results) {
				return handle_success(res, req.responseBase,
					{success: false, error: "Operation not implemented"}
				);
			}).catch(error_handler(res));
	}

	function filters(req, res, next) {
		var filters = param(req, 'filters', null, null);
		if (_.isArray(filters)) {
			filters = _.map(filters.split(','), function(s) {
				return s.trim();
			});
			if (filterProcessor) {
				filters = filterProcessor(filters);
			}
		}
		if (!_.isEmpty(filters)) {
			req.queryInterface = type.scope(filters);
		} else {
			req.queryInterface = type;
		}
		console.log(filters);
		next();
	}

	function count(req, res, next) {
		req.queryInterface.count().then(function(result) {
			var response = req.responseBase = req.responseBase || {};
			response = _.extend(response, {
				count: result
			})
			if (req.query && req.query.count) {
				return handle_success(res, response, {success: true});
			} else {
				req.responseBase = _.extend(req.responseBase, response);
				next();
			}
		}).catch(error_handler(res));
	}

	function pagination(req, res, next) {
		var offset = param(req, 'start', Number, list_options.offset);
		var limit = param(req, 'limit', Number, list_options.limit);
		req.responseBase = _.extend(req.responseBase||{}, {
			offset: offset,
			limit: limit
		});
		req.queryOptions = _.extend(req.queryOptions, {
			start: offset,
			limit: limit
		});
		next();
	}

	router.use(filters);
	router.use(pagination);
	router.use(count);
	router.get('/', list);
	router.post('/', create);
	router.post('/:id', update);
	router.delete('/:id', create);
	return router;
}
