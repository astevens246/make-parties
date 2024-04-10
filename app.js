// Initializations
const express = require('express');
const methodOverride = require('method-override')


const Handlebars = require('handlebars');


const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');


const app = express();
app.use(cookieParser("SECRET"));
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 60); // 60 days

app.use(session({
  secret: "SUPER_SECRET_SECRET",
  cookie: {expires: expiryDate },
  resave: false
}));
const bodyParser = require('body-parser');

const models = require('./db/models');

app.use(cookieParser());

const jwt = require('jsonwebtoken');




// MIDDLEWARE
app.use(function authenticateToken(req, res, next) {
  // Gather the jwt access token from the cookie
  const token = req.cookies.mpJWT;

  if (token) {
    jwt.verify(token, "AUTH-SECRET", (err, user) => {
      if (err) {
        console.log(err)
        // redirect to login if not logged in and trying to access a protected route
        res.redirect('/login')
      }
      req.user = user
      next(); // pass the execution off to whatever request the client intended
    })
  } else {
    next();
  }
});

app.use((req, res, next) => {
  // if a valid JWT token is present
  if (req.user) {
    // Look up the user's record
    models.User.findByPk(req.user.id).then(currentUser => {
      // make the user object available in all controllers and templates
      res.locals.currentUser = currentUser;
      next()
    }).catch(err => {
      console.log(err)
    })
  } else {    
    next();
  }
});

// The following line must appear AFTER const app = express() and before your routes!
app.use(bodyParser.urlencoded({ extended: true }));

// Create an instance of the expressHandlebars class with default layout 'main'
const hbs = expressHandlebars.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main'
});

// Use "main" as our default layout
app.engine('handlebars', hbs.engine);
// Use handlebars to render
app.set('view engine', 'handlebars');
// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

app.use(express.urlencoded({ extended: true }));
app.get('/me', (req, res) => {
  models.User.findOne({
    where: { id: req.user.id },
    include: [
      { model: models.Event },
      { model: models.Rsvp }
    ]
  }).then(user => {
    res.render('profile', { user: user });
  }).catch(err => {
    console.log(err);
    res.redirect('/');
  });
});

// app.get('/', (req, res) => {
//   console.log(req.user);
// });

// OUR MOCK ARRAY OF PROJECTS
var events = [
    { title: "Basketball game", desc: "A great event that is super fun to look at and good", imgUrl: "https://parade.com/.image/t_share/MTkwNTc4NDMyMDQ3Nzg1ODUy/golden-retriever.jpg" },
    { title: "Puppy bowl", desc: "A great event that is super fun to look at and good", imgUrl: "https://parade.com/.image/t_share/MTkwNTc4NDMyMDQ3Nzg1ODUy/golden-retriever.jpg" },
    { title: "Super bowl", desc: "A great event that is super fun to look at and good", imgUrl: "https://parade.com/.image/t_share/MTkwNTc4NDMyMDQ3Nzg1ODUy/golden-retriever.jpg" }
  ]
// CONTROLLERS REQUIRED  
require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);

const authRoutes = require('./controllers/auth');
app.use(authRoutes);
// STARTING APPLICATION
// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})