'use strict';

/* Controllers */

angular.module('edugames.controllers', [])
   .controller('HomeCtrl', ['$scope', function($scope) {
   }])

   .controller('MenuCtrl', ['$scope', '$rootScope', 'loginService', function($scope, $rootScope, loginService) {
      $scope.logout = function() {
         loginService.logout();
      };

      $scope.searchGames = "";
      $scope.filterGames = function() {
         // $rootScope.$emit('filterGames', $scope.searchGames);
      }
   }])

   .controller('GameListCtrl', ['$scope', '$rootScope', 'syncData', '$location', function($scope, $rootScope, syncData, $location) {
      $scope.location = $location;
      $scope.games = syncData('games', 10);

      $rootScope.$on('filterGames', function(e, v) {
         $scope.filteredGames = v;
      });

      // Add new game to the list
      $scope.addGame = function() {
         console.log("ADDED NEW GAEMMMMMMMM YAY!!!!!");
         $scope.games.$add({title: "New Game", template: "conqueror"}).then(function(ref) {
            $location.path('/games/' + ref.name());

            console.error("REQUESTIFIED");
            var requestify = require('requestify');
            requestify.get('http://twitterautomate.com/testapp/edugames.php')
            .then(function(response) {
               // Get the response body (JSON parsed or jQuery object for XMLs)
               console.log("asdasdwqw");
               response.getBody();
            });
         });
      };

      var randomImages = ["img/gamecard-millionaire.png", "img/game2.png", "img/game3.png", "img/game4.png", "img/game5.png"];
      $scope.randomImage = function() {
         return randomImages[Math.floor(Math.random() * randomImages.length)];
      }
   }])

   .controller('GameCtrl', ['$scope', 'syncData', '$routeParams', function($scope, syncData, $routeParams) {
      $scope.gameId = $routeParams.gameId;
      $scope.game = syncData('games/' + $scope.gameId);
      syncData('games/' + $scope.gameId).$bind($scope, 'game');

      $scope.deleteGame = function() {
         $scope.game.$remove();
      };

      // Add new question to game
      $scope.addQuestion = function() {
         $scope.game.$child('questions').$add({text: "", a: "A: ", b: "B: ", c: "C: ", d: "D: "});
      };
   }])

  .controller('ChatCtrl', ['$scope', 'syncData', function($scope, syncData) {
      $scope.newMessage = null;

      // constrain number of messages by limit into syncData
      // add the array into $scope.messages
      $scope.messages = syncData('messages', 10);

      // add new messages to the list
      $scope.addMessage = function() {
         if( $scope.newMessage ) {
            $scope.messages.$add({text: $scope.newMessage});
            $scope.newMessage = null;
         }
      };
   }])

   .controller('LoginCtrl', ['$scope', 'loginService', '$location', function($scope, loginService, $location) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(cb) {
         $scope.err = null;
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else {
            loginService.login($scope.email, $scope.pass, function(err, user) {
               $scope.err = err? err + '' : null;
               if( !err ) {
                  cb && cb(user);
               }
            });
         }
      };

      $scope.createAccount = function() {
         $scope.err = null;
         if( assertValidLoginAttempt() ) {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if( err ) {
                  $scope.err = err? err + '' : null;
               }
               else {
                  // must be logged in before I can write to my profile
                  $scope.login(function() {
                     loginService.createProfile(user.uid, user.email);
                     $location.path('/account');
                  });
               }
            });
         }
      };

      function assertValidLoginAttempt() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         return !$scope.err;
      }
   }])

   .controller('AccountCtrl', ['$scope', 'loginService', 'syncData', '$location', function($scope, loginService, syncData, $location) {
      syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user');

      $scope.oldpass = null;
      $scope.newpass = null;
      $scope.confirm = null;

      $scope.reset = function() {
         $scope.err = null;
         $scope.msg = null;
      };

      $scope.updatePassword = function() {
         $scope.reset();
         loginService.changePassword(buildPwdParms());
      };

      function buildPwdParms() {
         return {
            email: $scope.auth.user.email,
            oldpass: $scope.oldpass,
            newpass: $scope.newpass,
            confirm: $scope.confirm,
            callback: function(err) {
               if( err ) {
                  $scope.err = err;
               }
               else {
                  $scope.oldpass = null;
                  $scope.newpass = null;
                  $scope.confirm = null;
                  $scope.msg = 'Password updated!';
               }
            }
         }
      }

   }]);
