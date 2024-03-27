// Initializations
const express = require('express');
const methodOverride = require('method-override')

const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const expressHandlebars = require('express-handlebars');

const app = express();

const bodyParser = require('body-parser');

const models = require('./db/models');


// MIDDLEWARE

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

// Tell our app to send the "hello world" message to our home page
// app.get('/', (req, res) => {
//     res.render('home', { msg: 'Handlebars are Cool!' });
//   })

// OUR MOCK ARRAY OF PROJECTS
var events = [
    { title: "Basketball game", desc: "A great event that is super fun to look at and good", imgUrl: "https://parade.com/.image/t_share/MTkwNTc4NDMyMDQ3Nzg1ODUy/golden-retriever.jpg" },
    { title: "Puppy bowl", desc: "A great event that is super fun to look at and good", imgUrl: "https://parade.com/.image/t_share/MTkwNTc4NDMyMDQ3Nzg1ODUy/golden-retriever.jpg" },
    { title: "Super bowl", desc: "A great event that is super fun to look at and good", imgUrl: "https://parade.com/.image/t_share/MTkwNTc4NDMyMDQ3Nzg1ODUy/golden-retriever.jpg" }
  ]
// CONTROLLERS REQUIRED  
require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);


// STARTING APPLICATION
// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})