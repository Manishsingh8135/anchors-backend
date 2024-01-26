const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticateToken = require('../middleware/authenticateToken');


router.post('/post/:postId',authenticateToken, commentController.addCommentToPost);
router.post('/reply/:commentId',authenticateToken, commentController.replyToComment);
router.delete('/:commentId', authenticateToken,commentController.deleteComment);

module.exports = router;
