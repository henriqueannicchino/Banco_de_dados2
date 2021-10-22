const express = require('express');
const path = require('path');

const _handlebars = require('handlebars');
const exhbs = require('express-handlebars');
const {
	allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');

const session = require('express-session');
const passport = require('passport');

// Inicializations
const app = express();
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine(
	".hbs", 
	exhbs({
		defaultLayout: 'main',
		layoutsDir: path.join(app.get('views'), 'layouts'),
		partialsDir: path.join(app.get('views'), 'partials'),
		extname: '.hbs',
		handlebars: allowInsecurePrototypeAccess(_handlebars)
	})
);
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(
	session({
		secret: 'dexjduwpnswy',
		resave: false,
		saveUninitialized: true,
	})
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next)=>{
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.user = req.user || null;
	res.locals.pend = null;
	res.locals.pageOwner = null;
	next();
});

app.use(require('./routes/index.routes'));
app.use(require('./routes/notes.routes'));
app.use(require('./routes/users.routes'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;