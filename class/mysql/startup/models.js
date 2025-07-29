'use strict';

// Import Sequelize package
const Sequelize = require('sequelize');

// Import the configured Sequelize instance connected to the MySQL database
const sequelize = require('../config/v1/mysql');

const UserModel = require('../resources/v1/users/user.model');

// Initialize all models and store them in an object
const models = {
    User: UserModel.init(sequelize, Sequelize)
};

// If a model has an `associate` method, call it with the models object to set up relationships
Object.values(models)
    .filter(model => typeof model.associate === 'function') // Filter only those models with an associate method
    .forEach(model => model.associate(models));             // Call associate method to define relationships

// Prepare the database object for export
const db = {
    models,    // All initialized models
    sequelize  // Sequelize connection instance
};

// Export the db object so it can be imported in other parts of the application
module.exports = db;
