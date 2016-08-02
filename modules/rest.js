/**
 * Express.js router for a RESTful web service backed by Sequelize.
 */
var express = require('express');
var _ = require('underscore');

var debug = true;

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
	console.error('rest error: ', error);
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
	var responseFields = options.responseFileds;
	var requestFields = options.requestFields;

	var create_options = {};
	var update_options = {};
	var delete_options = {};
	var list_options = {
		limit: 20,
		start: 0,
		order: 'date DESC'
	}
	var get_options = {};
	if (_.isArray(requestFields)) { 
		_.extend(create_options, { fileds: requestFields });
		_.extend(update_options, { fileds: requestFields });
	}
	if (_.isArray(responseFields)) { 
		_.extend(list_options, { fileds: requestFields });
		_.extend(get_options, { fileds: requestFields });
	}

	function create(req, res) {
		if (debug) console.log("create: ", JSON.stringify(req.body));
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
		if (debug) console.log("list: ", JSON.stringify(req.body));
		req.queryInterface.findAll(req.queryOptions)
			.then(function(results) {
				handle_success(res, req.responseBase, {
					success: true,
					result: results
				});
			}).catch(error_handler(res));
	}

	function get(req, res) {
		if (debug) console.log("list: ", JSON.stringify(req.body));
		var id = Number(req.params.id);
		if (id && !isNaN(id)) {
			req.queryInterface.findById(id)
				.then(function(result) {
					handle_success(res, req.responseBase, {
						success: true,
						result: result
					});
				}).catch(error_handler(res));
		} else {
			handle_error(req, 400, "Wrong object ID parameter in request")
		}
	}

	function update(req, res) {
		if (debug) console.log("update: ", JSON.stringify(req.body));
		var id = Number(req.params.id);
		if (id && !isNaN(id)) {
			req.queryInterface.findById(id)
				.then(function(result) { performUpdate(req, res, result) })
				.catch(error_handler(res));
		} else {
			handle_error(req, 400, "Wrong object ID parameter in request")
		}
	}

	function performUpdate(req, res, instance) {
		var options = req.queryOptions;
		var data = _.extend(_.clone(instance.get({plain:true})), req.body);
		options.fileds = _.intersection(options.fileds, _.keys(data));
		data.id = instance.id;
		instance.update(data, options)
			.then(function() {
				handle_success(res, req.responseBase, {
					success: true,
					id: data.id
				});
			}).catch(error_handler(res));
	}

	function remove(req, res) {
		var id = Number(req.params.id);
		if (id && !isNaN(id)) {
			req.queryInterface.findById(id)
				.then(function(result) {
					return result.destroy();
				}).then(function() {
					handle_success(res, req.responseBase, {
						success: true,
						id: id
					});
				}).catch(error_handler(res));
		} else {
			handle_error(req, 400, "Wrong object ID parameter in request")
		}
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
		// TODO yin: count is required by list only, use findAndCount() instead
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
	router.get('/:id', get);
	router.post('/', create);
	router.post('/:id', update);
	router.delete('/:id', remove);
	return router;
}
