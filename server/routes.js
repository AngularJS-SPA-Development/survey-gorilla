/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors'),
    errorHandler = require('./components/errors/errorHandler');

var api = function(route) { return '/api' + route; };
var apiv1 = function(route) { return '/api/v1' + route; };

module.exports = function(app) {

  // response 객체에 setToken과 finish 메소드 추가  
  app.route(api('/*'))
    .all(function(req, res, next) {
        res.setToken = function(token) {
          res.setHeader('Auth-Token', token);
          res.token = token;
        };

        res.finish = function(data) {
          if(1 == arguments.length) {
            if ('number' == typeof data) {
              res.status(data);
            } 
          }

          if (2 == arguments.length) {
            if ('number' == typeof arguments[1]) {
              res.status(arguments[1]);
            } else {
              res.status(data);
              data = arguments[1];
            }
          }

          data = data || {};
          var result = { 'data': data };
          if (res.token) result.token = res.token;
          res.json(result);
        };

        next();
    });


  // Insert routes below
  app.use(apiv1('/groups'), require('./api/v1/group'));
  app.use(apiv1('/cards'), require('./api/v1/card'));
  app.use(apiv1('/users'), require('./api/v1/user'));

  app.use(api('/auth'), require('./auth'));
  
  // All undefined asset or api routes should return a 404
  //app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  // .get(errors[404]);

  // All undefined api routes should return a 404
  app.route(api('/*'))
    .all(function(req, res, next) {
      next(Error.new({
        code: 'API_NOT_FOUND',
        message: 'API for url:' + req.url + ' is not found.'
      }));
    });

  app.use(errorHandler());

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });

};
