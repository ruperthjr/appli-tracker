"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const configModule = require(__dirname + "/../config/config.js");
const config = configModule[env] || configModule;

const db = {};

let sequelize;
const buildOptions = (cfg) => {
  const opts = Object.assign({}, cfg);
  delete opts.use_env_variable;
  delete opts.url;
  return opts;
};

if (config.use_env_variable && process.env[config.use_env_variable]) {
  const connectionString = process.env[config.use_env_variable];
  const options = buildOptions(config);
  sequelize = new Sequelize(connectionString, options);
} else if (config.url) {
  const connectionString = config.url;
  const options = buildOptions(config);
  sequelize = new Sequelize(connectionString, options);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    buildOptions(config)
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;