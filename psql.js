var pg = require('pg');

/** Establishes a Postgresql connection and return the pg client. */
function psql(connectionString) {
	var client = new pg.Client(connectionString);
	var callback = arguments[1] || null;
	if(callback) {
		client.connect(callback);
	} else {
		client.connect();
	}
	return client;
}

/** Dummy placeholder for pooled connections */
function psql_pool(config) {
	// TODO yin: pooled connections
	return null;
	var pool = new pg.Pool(config);
	var callback = arguments[1] || null;
	if(callback) {
		pool.connect(callback);
	} else {
		pool.connect();
	}
	pool.on('error', function(err, client) {
		//TODO yin: Use proper logging
		console.error('idle client error:', err.message, err.stack);
	})
	return client;
}

exports = {psql};