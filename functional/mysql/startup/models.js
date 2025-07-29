const { sequelize } = require('../config/v1/mysql');
const User = require('../resources/v1/users/user.model');

const syncDatabase = async () =>{
    try {
        // Sync all models and associations
        await sequelize.sync({ force: true });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

module.exports = syncDatabase;
