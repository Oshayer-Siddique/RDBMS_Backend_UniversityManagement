const express = require('express');
const router = express.Router();

const { loginUser } = require('../Controllers/loginController');

router.post('/', loginUser);

module.exports = router;