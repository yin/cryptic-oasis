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

function handle_error(error) {
	// TODO yin: Add error mapping, for i18n and general UX and other RESTful funcs, like 404
	return res.json({ success: false, error: error.message });
}

function handle_success(res, responseBase, responseResult) {
	// TODO yin: Add error mapping, for i18n and general UX and other RESTful funcs, like 404
	return res.json({ success: false, error: error.message });
}

module.exports = function(sequelize, type) {
	var router = express.Router();

	function create(req, res) {
		req.queryInterface.build(req.body, req.queryOptions)
			.save()
			.then(function(completed) {
				return handle_success(res, {}, {
					success: true,
					result: completed
				});
			}).error(handle_error);
	}

	function list(req, res) {
		req.queryInterface.findAll(req.queryOptions)
			.then(function(results) {
				handle_success(res, req.responseBase, {
					success: true,
					result: results
				});
			}).catch(handle_error);
	}

	function update(req, res) {
		console.log("rest.update:" + req.params.id)
		req.queryInterface.findOne(req.queryOptions)
			.then(function(results) {
				return handle_success(res, req.responseBase,
					{success: false, error: "Operation not implemented"}
				);
			}).catch(handle_error);
	}

	function remove(req, res) {
		console.log("rest.delete:" + req.params.id)
		req.queryInterface.findOne(req.queryOptions)
			.then(function(results) {
				return handle_success(res, req.responseBase,
					{success: false, error: "Operation not implemented"}
				);
			}).catch(handle_error);
	}

	function filters(req, res, next) {
		if (req.query && req.query.filters)
			var filters = _.map(req.query.filters.split(','), function(s) {
				return s.trim();
			});
			if (filterProcessor) {
				filters = filterProcessor(filters);
			}
			if (filters.length) {
				req.queryInterface = type.scopes(filters);
			} else {
				req.queryInterface = type;
			}
		}
	}

	function count(req, res, next) {
		type.count().then(function(result) {
			var response = req.responseBase = req.responseBase || {};
			response = _.extend(response, {
				count: result
			})
			if (req.query && req.query.count) {
				return handle_success(res, response, {success: true});
			} else {
				req.responseBase = response;
				next();
			}
		}).catch(handle_error);
	}

	function pagination(req, res, next) {
		var offset = param(req, 'start', list_options.offset);
		var limit = param(req, 'limit', list_options.limit);
		req.responseBase = _.extend(req.responseBase, {
			offset: offset,
			limit: limit
		});
		req.queryOptions = _.extend(req.queryOptions, {
			start: offset,
			limit: limit
		});
		next();
	}

	router.use(pagination);
	router.use(count);
	router.get('/', list);
	router.post('/', create);
	router.update('/:id', list);
	router.delete('/:id', create);
	return router;
}
