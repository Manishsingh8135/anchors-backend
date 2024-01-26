const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes here, e.g., router.post('/register', userController.register);
// New GET route for testing
router.get('/test', (req, res) => {
    res.send('Test route is working!');
});

router.post('/register', userController.register);
router.post('/verify-otp', userController.verifyOTP);
router.post('/login', userController.login);


module.exports = router;
