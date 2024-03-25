const express = require('express');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const expressHandlebars = require('express-handlebars');

const app = express();

// Create an instance of the expressHandlebars class with default layout 'main'
const hbs = expressHandlebars.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main'
});

// Use "main" as our default layout
app.engine('handlebars', hbs.engine);
// Use handlebars to render
app.set('view engine', 'handlebars');

// Tell our app to send the "hello world" message to our home page
app.get('/', (req, res) => {
    res.render('home', { msg: 'Handlebars are Cool!' });
  })

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})