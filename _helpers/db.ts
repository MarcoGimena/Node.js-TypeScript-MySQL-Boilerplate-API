import config from '../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account-model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize();

async function initialize() {
    // Read from Render environment variables directly, or use local fallbacks if running locally
    const host = process.env.DB_HOST || (config && config.database ? config.database.host : 'localhost');
    const port = Number(process.env.DB_PORT) || (config && config.database ? config.database.port : 3306);
    const user = process.env.DB_USER || (config && config.database ? config.database.user : 'root');
    const password = process.env.DB_PASSWORD || (config && config.database ? config.database.password : '');
    const database = process.env.DB_NAME || (config && config.database ? config.database.database : 'my_database');

    // Create DB if it doesn't exist
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // Connect to DB
    const sequelize = new Sequelize(database, user, password, { 
        host: host,
        port: port,
        dialect: 'mysql' 
    });

    // Init models
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    // Define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // Sync models with database
    await sequelize.sync();
}