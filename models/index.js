'use strict';

const { Sequelize } = require('sequelize');

const config = require(__dirname + '/../config/postgres_config.js');

const db = {};

const sequelize = new Sequelize(config);

db.images = require("./image.js")(sequelize, Sequelize.DataTypes);
db.styles = require("./style.js")(sequelize, Sequelize.DataTypes);
db.apikeys = require("./api-key.js")(sequelize, Sequelize.DataTypes);

module.exports = db;
