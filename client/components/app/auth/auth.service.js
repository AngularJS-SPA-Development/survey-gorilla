(function(){
  'use strict';

  angular
    .module('sg.app')
    .factory('Auth', Auth);

  /* @ngInject */
  function Auth($location, $rootScope, $http, $cookies, User, storageService, $q) {
    var currentUser = {};
    if(storageService.get('token')) {
      User.get({}, function(result) {
        currentUser = result.data;
      });
    }

    return {
      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: login,

      /**
       * authenticate with OAuth in facebook, twitter
       * @type {[type]}
       */
      loginOAuth: loginOAuth,

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: logout,

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: createUser,

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: changePassword,

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: getCurrentUser,

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: isLoggedIn,

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: isLoggedInAsync,

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: isAdmin,

      /**
       * Get auth token
       */
      getToken: getToken
    };

    function login(user, callback) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();

      $http.post('/api/auth/local', {
        email: user.email,
        password: user.password
      }).
      success(function(data) {
        // 기존 코드 
        // $cookieStore.put('token', data.token);

        // 변경 코드 
        storageService.put('token', data.token);

        // 사용자 정보 가져와 currentUser에 저장 
        User.get({}, function(result) {
          currentUser = result.data;
        });

        deferred.resolve(data);
        return cb();
      }).
      error(function(err) {
        this.logout();
        deferred.reject(err);
        return cb(err);
      }.bind(this));

      return deferred.promise;
    };

    function loginOAuth(callback) {
      var cb = callback || angular.noop;
      var token = $cookies.token;
      if(token) {
        storageService.put('token', token);
        User.get({}, function(result) {
          currentUser = result.data;
        });
        return cb();
      }
    }

    function logout() {
      storageService.remove('token');
      currentUser = {};
    };

    function createUser(user, callback) {
      var cb = callback || angular.noop;

      return User.save(user,
        function(data) {
          storageService.put('token', data.token);
          User.get({}, function(result) {
            currentUser = result.data;
          });
          return cb(user);
        },
        function(err) {
          this.logout();
          return cb(err);
        }.bind(this)).$promise;
    }

    function changePassword(oldPassword, newPassword, callback) {
      var cb = callback || angular.noop;

      return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
    }

    function getCurrentUser() {
      return currentUser;
    }

    function isLoggedIn() {
      return currentUser.hasOwnProperty('role');
    }

    function isLoggedInAsync(cb) {
      if(currentUser.hasOwnProperty('$promise')) {
        currentUser.$promise.then(function() {
          cb(true);
        }).catch(function() {
          cb(false);
        });
      } else if(currentUser.hasOwnProperty('role')) {
        cb(true);
      } else {
        cb(false);
      }
    }

    function isAdmin() {
      return currentUser.role === 'admin';
    }

    function getToken() {
      return storageService.get('token');
    }

  }

})();
