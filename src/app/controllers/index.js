const express = require('express');
const router = express.Router();

const authController = require('./authController');
const projectController = require('./projectController');

router.use('/auth', authController);
router.use('/projects', projectController);

module.exports = router;
