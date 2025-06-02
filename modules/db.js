const mysql = require('mysql2/promise');
require('dotenv').config();

// TODO: transaction

let pool = null;

const getPool = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_USERNAME,
            connectionLimit: 10,
            waitForConnections: true,
            enableKeepAlive: true
        });
    }
    return pool;
};

export const db = async (sql, params = []) => {
    const conn = await getPool().getConnection();
    try {
        const [rows] = await conn.execute(sql, params);
        return rows;
    } finally {
        conn.release();
    }
};