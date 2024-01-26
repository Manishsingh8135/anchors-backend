const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const { sendEmail } = require('../utils/otpHelper');

const postController = {
    // Create a new post
    createPost: async (req, res) => {
        try {
            const { title, content } = req.body;
            const userId = req.user.id; // Assuming req.user is populated from the JWT middleware

            const post = new Post({
                title,
                content,
                user: userId
            });

            await post.save();

            // Retrieve user information to get the email
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            try {
                await sendEmail(
                    user.email,
                    'Post Creation Success',
                    'Congrats! Your post is live now.'
                );
            } catch (error) {
                console.log("Mail not sent", error);
            }

            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all posts
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find().populate('user', 'name');
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get a single post by ID
    getPostById: async (req, res) => {
        try {
            const postId = req.params.postId;
            const post = await Post.findById(postId).populate('user', 'name');

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = postController;
