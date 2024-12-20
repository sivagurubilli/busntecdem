'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// if (!config.dialectOptions) {
//   config.dialectOptions = {};
// }
// config.dialectOptions.maxAllowedPacket = 64 * 1024 * 1024; // 64MB

// config.define.dialectOptions.maxAllowedPacket = 64 * 1024 * 1024;

/*config.define= {
  charset: 'utf8',
  collate: 'utf8_general_ci', 
  timestamps: true
},*/
config.logging = true
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
  // sequelize.query("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));");
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    maxAllowedPacket: 64 * 1024 * 1024
  });
  sequelize.query("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));");
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// sequelize.sync({ alter: true })
// sequelize.sync()


db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
