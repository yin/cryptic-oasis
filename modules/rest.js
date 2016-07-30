/**
 * Express.js router for a RESTful web service backed by Sequelize.
 */
var express = require('express');
var _ = require('underscore');

var create_options = {
}
var list_options = {
	limit: 20,
	start: 0,
	order: 'date DESC'
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
	console.error('sequelize error: ', error);
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
		req.queryInterface.findOne(req.queryOptions)
			.then(function(results) {
				return handle_success(res, req.responseBase,
					{success: false, error: "Operation not implemented"}
				);
			}).catch(error_handler(res));
	}

	function remove(req, res) {
		req.queryInterface.findOne(req.queryOptions)
			.then(function(results) {
				return handle_success(res, req.responseBase,
					{success: false, error: "Operation not implemented"}
				);
			}).catch(error_handler(res));
	}

	function filters(req, res, next) {
		var filtersParam = param(req, 'filters', null, null);
		var filters;
		if (filtersParam) {
			filters = filtersParam.split(',');
			if (_.isArray(filters)) {
				filters = _.map(filters, function(s) {
					return s.trim();
				});
				if (filterProcessor) {
					filters = filterProcessor(filters);
				}
			}
		}
		if (!_.isEmpty(filters)) {
			req.queryInterface = type.scope(filters);
		} else {
			req.queryInterface = type;
		}
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
		var start = param(req, 'start', Number, list_options.start);
		var limit = param(req, 'limit', Number, list_options.limit);
		var order = param(req, 'order', Number, list_options.order);
		req.responseBase = _.extend(req.responseBase||{}, {
			start: start,
			limit: limit,
			order: order
		});
		req.queryOptions = _.extend(req.queryOptions||{}, {
			offset: start,
			limit: limit,
			orderBy: order
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
