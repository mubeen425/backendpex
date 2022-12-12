const { Sequelize } = require("sequelize");
const { DEVELOPMENT, PRODUCTION } = require("./constants");

const CONNECTION = DEVELOPMENT;

module.exports = new Sequelize(
  CONNECTION.DATABASE,
  CONNECTION.USERNAME,
  CONNECTION.PASSWORD,
  {
    host: CONNECTION.HOST,
    dialect: "mysql",
    logging: false,
    // port: CONNECTION.PORT,
  }
);
