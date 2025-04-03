require("dotenv").config();

const env = process.env.NODE_ENV || 'development';

var postgres = require(__dirname + '/config.json');
// postgres['development'].logging = console.log;
postgres['development'].logging = null;

var postgres_config = postgres[env];
postgres_config.host = process.env.DB_HOST || "127.0.0.1";
postgres_config.port = process.env.DB_PORT || 5432;
postgres_config.password = process.env.POSTGRESDB_ROOT_PASSWORD;

console.log("Sequelize postgres_config: ", postgres_config);

module.exports = postgres_config;

