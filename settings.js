var utils = require('./lib/utils.js');

module.exports = function(app, express, nconf) {
  // app.configure
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });

  // body parser
  app.use(express.bodyParser());

  // override with X-HTTP-Method-Override header in request
  app.use(express.methodOverride());

  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  app.use(express.static(__dirname + '/public'));

  app.use(app.router);

  // last handler, assume 404 at this point
  app.use(utils.render404);
}
