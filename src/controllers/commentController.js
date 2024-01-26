const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const { sendEmail } = require('../utils/otpHelper');
const User = require('../models/UserModel')


const commentController = {
    // Add a comment to a post
    addCommentToPost: async (req, res) => {
        try {
            const { content } = req.body;
            const postId = req.params.postId;
            const userId = req.user.id; // Assuming req.user is populated from the JWT middleware

            // Find the post to comment on
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Create a new comment
            const comment = new Comment({
                content,
                post: postId,
                user: userId
            });

            // Save the comment
            await comment.save();

            // Retrieve the post owner's information
            const postOwner = await User.findById(post.user);
            if (!postOwner) {
                return res.status(404).json({ message: 'Post owner not found' });
            }

            // Send an email to the post owner about the new comment
            try {
                await sendEmail(
                    postOwner.email,
                    'New Comment on Your Post',
                    `${req.user.name} commented on your post titled "${post.title}".`
                );
            } catch (error) {
                console.log("Mail not sent", error);
            }

            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Reply to a comment
    replyToComment: async (req, res) => {
        try {
            const { content } = req.body;
            const commentId = req.params.commentId;
            const userId = req.user.id; // Assuming req.user is populated from the JWT middleware

            const parentComment = await Comment.findById(commentId).populate('user');
            if (!parentComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            const replyComment = new Comment({
                content,
                post: parentComment.post,
                user: userId,
                replyTo: commentId
            });

            await replyComment.save();

            // Check if the user replying is different from the user who made the original comment
            if (parentComment.user._id.toString() !== userId) {
                try {
                    // Retrieve the original commenter's details
                    const originalCommenter = await User.findById(parentComment.user._id);
                    if (!originalCommenter) {
                        return res.status(404).json({ message: 'Original commenter not found' });
                    }

                    // Send an email to the original commenter
                    await sendEmail(
                        originalCommenter.email,
                        'Reply to Your Comment',
                        `Someone has replied to your comment.`
                    );
                } catch (error) {
                    console.log("Mail not sent", error);
                }
            }

            res.status(201).json(replyComment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    // Delete a comment
    deleteComment: async (req, res) => {
        try {
            const commentId = req.params.commentId;
            const userId = req.user.id; // User ID from JWT

            // Find the comment
            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            // Find the post to check if the user owns it
            const post = await Post.findById(comment.post);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Check if the logged-in user is the owner of the post
            if (post.user.toString() !== userId) {
                return res.status(403).json({ message: 'You can only delete comments on your posts' });
            }

            // Delete the comment
            await Comment.findByIdAndDelete(commentId);

            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }



};

module.exports = commentController;




