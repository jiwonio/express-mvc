const express = require('express');
const router = express.Router();
const { getUsersWithDetails, getTotalCount } = require('../model/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET /users/sample - 사용자 목록 조회
router.get('/sample', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // 함수를 직접 호출
    const [users, total] = await Promise.all([
      getUsersWithDetails({ limit, offset }),
      getTotalCount()
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /users/sample/:id - 특정 사용자 상세 조회
router.get('/sample/:id', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // 단일 사용자 조회
    const users = await getUsersWithDetails({
      limit: 1,
      offset: 0,
      userId
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
