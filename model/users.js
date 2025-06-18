// models/users.js
const {db} = require("../modules/db");

/**
 * bar와 foo 테이블을 조인하여 사용자 정보를 조회합니다
 * @param {Object} options 검색 옵션
 * @param {number} options.limit 조회할 레코드 수
 * @param {number} options.offset 건너뛸 레코드 수
 * @param {number} options.userId 특정 사용자 ID (선택적)
 * @returns {Promise<Array>} 조회된 사용자 정보
 */
const getUsersWithDetails = async ({ limit = 10, offset = 0, userId = null } = {}) => {
    let sql = `
        SELECT 
            b.id AS bar_id,
            b.name AS bar_name,
            b.created_at AS bar_created_at,
            f.id AS foo_id,
            f.title AS foo_title,
            f.description AS foo_description
        FROM bar b
        LEFT JOIN foo f ON b.foo_id = f.id
    `;

    const params = [];

    if (userId) {
        sql += ' WHERE b.id = ?';
        params.push(userId);
    }

    sql += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return await db(sql, params);
};

/**
 * bar와 foo 테이블의 전체 레코드 수를 조회합니다
 * @returns {Promise<number>} 전체 레코드 수
 */
const getTotalCount = async () => {
    const sql = `
        SELECT COUNT(*) as total
        FROM bar b
        LEFT JOIN foo f ON b.foo_id = f.id
    `;

    const [result] = await db(sql);
    return result.total;
};

module.exports = {
    getUsersWithDetails,
    getTotalCount
};