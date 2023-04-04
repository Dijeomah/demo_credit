const knexConfig = require('./knexfile');
//initialize knex
const knexDb = require('knex')(knexConfig[process.env.DB_CONN_ENV || "development"])

module.exports = knexDb;
