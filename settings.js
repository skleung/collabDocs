var stylus = require('stylus');
var utils = require('./lib/utils');

/**
 * Sets up the given express application.
 *
 * @param app - the express application
 * @param express - the express library
 * @param nconf - the configuration settings
 */
module.exports = function(app, express, nconf) {
  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(stylus.middleware({
      src: __dirname + '/public',
      dest: __dirname + '/public',
      compile: function(str, path, fn) {
        return stylus(str)
          .set('filename', path)
          .set('compress', true)
          .set('warn', true);
      }
    }));

    app.use(express.static(__dirname + '/public'));
    app.use(app.router);

    // last handler; assume 404 at this point 
    app.use(utils.render404);
  });

  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    app.use(express.errorHandler());
    app.set('napkin', 0);
  });
};
