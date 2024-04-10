const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../db/models/user');
const models = require('../db/models');
const jwt = require('jsonwebtoken');


function generateJWT(user) {
    const mpJWT = jwt.sign({ id: user.id }, "AUTH-SECRET", { expiresIn: 60*60*24*60 });
  
    return mpJWT
  }
// GET /sign-up route and template
router.get('/sign-up', (req, res) => {
    res.render('sign-up');
});

// GET /login route and template 
router.get('/login', (req, res) => {
    res.render('login');
});

// POST /sign-up route
router.post('/sign-up', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({ firstName, lastName, email, password: hashedPassword });
  
    // create the JWT token after the user is created
    const mpJWT = generateJWT(user);
  
    // save the JWT token as a cookie
    res.cookie("mpJWT", mpJWT);
  
    // redirect to the root route
    res.redirect('/');
  });

// LOGIN (POST)
router.post('/login', function(req, res) {
    models.User.findOne({ where: { email: req.body.email } }).then(function(user) {
      if (!user) {
        // No user found with the provided email
        return res.status(401).send({ message: 'No user found with the provided email.' });
      }
  
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ message: 'Invalid password.' });
        }
  
        var token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('mpJWT', token);
        res.redirect('/');
      });
    });
  });

// LOGOUT
router.get('/logout', (req, res, next) => {
    res.clearCookie('mpJWT');
  
    // req.session.sessionFlash = { type: 'success', message: 'Successfully logged out!' }
    // comment the above line in once you have error messaging setup (step 15 below)
    return res.redirect('/');
  });

router.post('/update', (req, res) => {
models.User.update(
    { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email },
    { where: { id: req.user.id } }
).then(() => {
    res.redirect('/me');
}).catch(err => {
    console.log(err);
    res.redirect('/me');
});
});

router.post('/destroy', (req, res) => {
    models.User.destroy({ where: { id: req.user.id } }).then(() => {
      res.clearCookie('mpJWT');
      res.redirect('/login');
    }).catch(err => {
      console.log(err);
      res.redirect('/me');
    });
  });

module.exports = router;