require('dotenv').config();
const Sequelize = require('sequelize');

/** Establish the connection with DB */
const sequelize = new Sequelize(process.env.MYSQL_DB_NAME, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    logging : false
});

sequelize.authenticate().then(() => {
    console.log('Connected to mysql');
}).catch((err) => {
    console.log('error connecting to mysql: ', err.message);
});

module.exports = sequelize