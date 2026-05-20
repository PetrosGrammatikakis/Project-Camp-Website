if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}



const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const helmet = require('helmet')
const { MongoStore } = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/project-camp';



// Database connection
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
  console.log('Database connected');
}

// Middleware setup
app.set('query parser', 'extended');
app.use(express.static(path.join(__dirname, 'public')))
app.use(sanitizeV5({ replaceWith: '_' }));
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.set('views', path.join(__dirname, '/views'));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: 'thisshouldbeabettersecret!'
  }
})


store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e)
})


// Session configuration
const sessionConfig = {
  store,
  name: "ProjectCamp",
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
]
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",

  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
];
const connectSrcUrls = [

  "https://api.maptiler.com/",
];

const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/do71ozwtk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
        "https://api.maptiler.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);



// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


//routes



app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);




app.get('/', (req, res) => {
  return res.render('home');
});







// Error handling middleware
app.all('/{*path}', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});


app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  const { statusCode = 500, message = 'Something went wrong!' } = err;

  res.status(statusCode).render('errors', {
    statusCode,
    message
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});





