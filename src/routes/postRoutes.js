const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

const authenticateToken = require('../middleware/authenticateToken');

router.post('/', authenticateToken, postController.createPost);

router.get('/',authenticateToken, postController.getAllPosts);
router.get('/:postId', postController.getPostById);

module.exports = router;
