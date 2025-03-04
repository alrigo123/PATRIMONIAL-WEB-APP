import { createPool } from 'mysql2/promise'; //pool to use 
import { config } from 'dotenv';
config(); //Cargar las variables del archivo .env

// Local Host
const pool = new createPool({
    host: 'localhost',
    user: process.env.DB_USER_LOCAL,
    password: '',
    database: process.env.DB_NAME_LOCAL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// Clever cloud
// const pool = new createPool({
//     host: process.env.DB_HOST_CLOUD,
//     user: process.env.DB_USER_CLOUD,
//     password: process.env.DB_PASSWORD_CLOUD,
//     database: process.env.DB_NAME_CLOUD,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// })

// Hostgator GERAGRI
// const pool = new createPool({
//     host: process.env.DB_HOST_HGATOR,
//     user: process.env.DB_USER_HGATOR,
//     password: process.env.DB_PASSWORD_HGATOR,
//     database: process.env.DB_NAME_HGATOR
// })

// Docker VM server
// const pool = new createPool({
//     host: process.env.DB_HOST_DOCKER,
//     user: process.env.DB_USER_DOCKER,
//     password: process.env.DB_PASSWORD_DOCKER,
//     database: process.env.DB_NAME_DOCKER,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// })

// Docker VM server GERAGRI
// const pool = new createPool({
//     host: process.env.DB_HOST_DOCKER_G,
//     user: process.env.DB_USER_DOCKER_G,
//     password: process.env.DB_PASSWORD_DOCKER_G,
//     database: process.env.DB_NAME_DOCKER_G,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// })

// Check database connection
async function checkConnection() {
    try {
        const connection = await pool.getConnection(); // Intentar obtener una conexión
        // console.log(`Connected to BD`)
        console.log('Conexión establecida como id ' + connection.threadId);
        connection.release(); // Liberar la conexión al pool
    } catch (error) {
        console.error('Error in the database connection:', error.stack);
    }
}

// Llamar a la función
checkConnection();

export default pool;