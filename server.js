const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const multer = require(`multer`);
const { checkFileType } = require(`./multerS3`)
const upload = multer({
  limits: {
    fileSize: 2000000, //MAX IMAGE SIZE 2MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  }
});


// Database connection
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
console.log(upload);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.single(`profile_picture`))
// app.use(upload.fields())
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.limit(100000000));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}`));
});
