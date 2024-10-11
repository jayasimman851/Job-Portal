const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Search for resumes
router.get('/search-resumes', async (req, res) => {
    const { name } = req.query;
    const users = await User.find({
        name: new RegExp(name, 'i')
    });
    res.render('resumes', { users });
});
// Sign up route
router.get('/signup', (req, res) => {
    res.render('signup'); // Render the signup page
});

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.redirect('/login'); // Redirect to login after signup
    } catch (error) {
        console.error(error);
        res.status(500).send('Error signing up');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('login'); // Render the login page
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send('Invalid email or password');
        }
        // Set a session or cookie here to keep the user logged in
        // For example: req.session.userId = user._id;
        res.redirect('/'); // Redirect to the home page after login
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
});

module.exports = router;