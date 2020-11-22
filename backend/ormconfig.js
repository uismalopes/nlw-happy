module.exports = {
    "type": process.env.DB_TYPE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "migrations": [
        "./src/database/migrations/*.ts"
    ],
    "entities": [
        "./src/models/*.ts"
    ],
    "cli": {
        "migrationsDir": "./src/database/migrations"
    }
}