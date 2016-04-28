(function(){

	'use strict';
	var PVRCinemas = angular.module('PVRCinemas',['ngRoute']);
	PVRCinemas.config(function($routeProvider){
		$routeProvider
		.when('/',{
			templateUrl : './views/home.html'
		})
		.when('/bookSeats',{
			templateUrl : './views/bookSeats.html'
		})
		.when('/confirmTicket',{
			templateUrl : './views/confirmTicket.html'
		});
	});
})();