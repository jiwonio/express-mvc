const express = require('express');
const router = express.Router();

/* GET '/api' */
router.get('/', function(req, res, next) {
  res.json({
    success: true,
    data: {
      message: 'API is working'
    }
  });
});

module.exports = router;
