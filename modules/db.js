const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

const getPool = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            connectionLimit: 10,
            waitForConnections: true,
            enableKeepAlive: true
        });
    }
    return pool;
};

const db = async (sql, params = []) => {
    const conn = await getPool().getConnection();
    try {
        const [rows] = await conn.execute(sql, params);
        return rows;
    } finally {
        conn.release();
    }
};

const transaction = async (callback) => {
    const conn = await getPool().getConnection();
    await conn.beginTransaction();

    try {
        const result = await callback(conn);
        await conn.commit();
        return result;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

module.exports = { db, transaction };