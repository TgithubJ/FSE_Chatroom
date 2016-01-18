var app = angular.module('chatApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	
	$rootScope.signout = function(){
    	$http.get('/auth/signout');
    	$rootScope.authenticated = false;
    	$rootScope.current_user = '';
	};
});

app.config(function($routeProvider){
	$routeProvider
		
		//the timeline display
		.when('/', {
			templateUrl: 'chat.html',
			controller: 'chatController'
		})
		
		//the login display
		.when('/signin', {
			templateUrl: 'signin.html',
			controller: 'authController'
		})
		
		//the signup display
		.when('/signup', {
			templateUrl: 'signup.html',
			controller: 'authController'
		});
});

app.factory('chatService', function($resource){
	return $resource('/api/chats/:id');
});

app.controller('chatController', function(chatService, $scope, $rootScope){
	
	$scope.chats = chatService.query();
	$scope.newChat = {username: '', text: '', created_at: ''};

	$scope.chat = function() {
	  $scope.newChat.username = $rootScope.current_user;
	  $scope.newChat.created_at = Date.now();
	  chatService.save($scope.newChat, function(){
	    $scope.chats = chatService.query();
	    $scope.newChat = {username: '', text: '', created_at: ''};
	  });
	};
});

app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.signin = function(){
    $http.post('/auth/signin', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.signup = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});