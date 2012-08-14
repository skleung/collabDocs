/**
 * Creates the routes for the given express application.
 *
 * @param app - the express application
 * @param nconf - the configuration settings
 */
module.exports = function(app, nconf) {
  app.get('/', function(request, response) {
    response.render('index');
  });
};
