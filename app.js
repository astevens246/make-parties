const express = require('express');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const expressHandlebars = require('express-handlebars');

const app = express();

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');

const models = require('./db/models');

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
  
    // INDEX
    app.get('/', (req, res) => {
        models.Event.findAll().then(events => {
        res.render('events-index', { events: events });
        })
    })

    // NEW
    app.get('/events/new', (req, res) => {
        res.render('events-new', {});
    })
    
    // CREATE
    app.post('/events', (req, res) => {
        models.Event.create(req.body).then(event => {
            // Redirect to events/:id
            res.redirect(`/events/${event.id}`)
        }).catch((err) => {
            console.log(err)
        });
    })

    // SHOW
    app.get('/events/:id', (req, res) => {
        // Search for the event by its id that was passed in via req.params
        models.Event.findByPk(req.params.id).then((event) => {
        // If the id is for a valid event, show it
        res.render('events-show', { event: event })
        }).catch((err) => {
        // if they id was for an event not in our db, log an error
        console.log(err.message);
        })
    })

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})