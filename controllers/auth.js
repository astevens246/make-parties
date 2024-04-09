const express = require('express');
const router = express.Router();

// GET /sign-up route and template
router.get('/sign-up', (req, res) => {
    res.render('sign-up');
});

// GET /login route and template 
router.get('/login', (req, res) => {
    res.render('login');
});

// POST /sign-up route
router.post('/sign-up', (req, res) => {
    console.log(req.body);
    // Add your sign-up logic here...
    res.send('Sign-up form submitted');
});

// POST /login route
router.post('/login', (req, res) => {
    console.log(req.body);
    // Add your login logic here...
    res.send('Login form submitted');
});

module.exports = router;