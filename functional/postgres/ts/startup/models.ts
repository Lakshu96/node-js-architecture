import {sequelize} from "../config/v1/postgres"

const syncDatabase = async (): Promise<void> => {
    try {
        // Sync all models and associations
        await sequelize.sync({ force: true });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Error syncing database:', (error as Error).message);
    }
};

export default syncDatabase;
