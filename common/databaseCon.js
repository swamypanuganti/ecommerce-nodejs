const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
async function databaseConnection() {
    const sequelizeCon = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    });


    const db = {};
    db.Sequelize = Sequelize;
    db.sequelizeCon = sequelizeCon;
    // db.sequelizeCon.sync();
    // db.sequelizeCon.sync({ alter: true });
    db.products = require("../models/products")(sequelizeCon, Sequelize);
    db.categories = require("../models/categories.js")(sequelizeCon, Sequelize);
    return db;
}
module.exports.databaseConnection = databaseConnection;

async function closeDatabase(sequelizeCon) {
    sequelizeCon.close();
}
module.exports.closeDatabase = closeDatabase; 