(function(){
  'use strict';

  angular
    .module('sg.app')
    .factory('Auth', Auth);

  /* @ngInject */
  function Auth($location, $rootScope, $http, $cookies, User, storage, $q) {
    var currentUser = undefined;
    if(storage.get('token')) {
      User.get({}, function(result) {
        currentUser = result.data;
      });
    }

    return {
      /**
       * Authenticate user and save token
       */
      login: login,

      /**
       * authenticate with OAuth in facebook, twitter
       */
      loginOAuth: loginOAuth,

      /**
       * Delete access token and user info
       */
      logout: logout,

      /**
       * Create a new user
       */
      createUser: createUser,

      /**
       * Change password
       */
      changePassword: changePassword,

      /**
       * Gets all available info on authenticated user
       */
      getCurrentUser: getCurrentUser,

      /**
       * Check if a user is logged in
       */
      isLoggedIn: isLoggedIn,

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: isLoggedInAsync,

      /**
       * Check if a user is an admin
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
        storage.put('token', data.token);

        // 사용자 정보 가져와 currentUser에 저장 
        User.get({}, function(result) {
          currentUser = result.data;
          storage.put('user', currentUser);
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
        storage.put('token', token);
        User.get({}, function(result) {
          currentUser = result.data;
        });
        return cb();
      }
    }

    function logout() {
      storage.flush();
      currentUser = undefined;
    };

    function createUser(user, callback) {
      var cb = callback || angular.noop;

      return User.save(user,
        function(data) {
          storage.put('token', data.token);
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
      if(!currentUser) {
        return false;
      }
      return currentUser.hasOwnProperty('role');
    }

    function isLoggedInAsync(cb) {
      if(!currentUser) {
        return false;
      }

      if(!currentUser.hasOwnProperty('role')) {
        currentUser = storage.get('user');
      }

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
      if(!currentUser) {
        return false;
      }
      return currentUser.role === 'admin';
    }

    function getToken() {
      return storage.get('token');
    }

  }

})();
