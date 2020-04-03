const express = require ('express');
const morgan = require ('morgan');
const exphbs = require ('express-handlebars');
const path = require('path');
const passport = require ('passport');
const flash= require('connect-flash');
const session=require('express-session');
const MySQLStore=require('express-mysql-session');

const { database } = require('./keys');





//iniciar
const app = express();
require('./lib/passport');

//configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
  secret: 'carmysqlsession',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)

}));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
//app.use(validator());


//Variables Globales
app.use((req, res, next)=>{
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  app.locals.user = req.user
  next();
});

//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));



//Publico
app.use(express.static(path.join(__dirname, 'public')));

//Iniciar Servidor

app.listen (app.get('port') ,()=>{
    console.log('Server on port', app.get('port'));

});