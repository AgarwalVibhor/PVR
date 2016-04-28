(function(){

	'use strict';
	angular.module('PVRCinemas').controller('HomeController', HomeController);

	HomeController.$inject = ['$scope', '$http', '$rootScope'];
	function HomeController($scope, $http, $rootScope)
	{
		$scope.getLanguages = getLanguagesFn;
		$scope.getMovies = getMoviesFn;
		$scope.chooseSeats = chooseSeatsFn;
		$scope.checkAvailability = checkAvailabilityFn;
		$scope.checkSeats = checkSeatsFn;
		$scope.checkTemp = checkTempFn;
		$scope.city = "0";
		$scope.language = "0";
		$scope.movie = "0";
		$scope.theatre = "0";
		$scope.show = "0";
		$scope.date = "initial";
		$scope.noOfSeats = "0";
		$scope.getMovieDetails = getMovieDetailsFn;
		$scope.available = 0;
		$scope.flag = false;
		$scope.temp = false;
		$scope.message = "";
		$scope.flag1 = false;

		function getLanguagesFn(){
			var req = {
				method : 'GET',
				url : '/getLanguages'
			};
			$http(req).then(successGetLanguages, function(res){
				console.log("An error has occured in retreiving languages");
			});
		}

		function successGetLanguages(res){
			$scope.citiesList = res.data.cities;
			$scope.languagesList = res.data.languages;
		}

		function getMoviesFn(){
			console.log($scope.city);
			console.log($scope.language);
			var req = {
				method : 'GET',
				url : '/getMovies',
				params : {
					language : $scope.language
				}
			};
			$http(req).then(successGetMovies, function(res){
				console.log("An error occured in retreiving movies");
			});
		}

		function successGetMovies(res){
			$scope.moviesList = res.data.movies;
		}

		function getMovieDetailsFn(){

			var req = {
				method : 'GET',
				url : '/getMovieDetails',
				params : {
					movie : $scope.movie
				}
			};
			$http(req).then(successGetMovieDetails, function(res){
				console.log("An error occured in getting the details of the movie");
			});
		}

		function successGetMovieDetails(res){
			$scope.theatresList = res.data.theatres;
			$scope.showsList = res.data.shows;
			$scope.datesList = res.data.dates;
		}

		function chooseSeatsFn(){

			if($scope.city == "0")
			{
				document.getElementById('city').focus();
				return false;
			}
			if($scope.language == "0")
			{
				document.getElementById('language').focus();
				return false;
			}
			if($scope.movie == "0")
			{
				document.getElementById('movie').focus();
				return false;
			}
			if($scope.theatre == "0")
			{
				document.getElementById('theatre').focus();
				return false;
			}
			if($scope.show == "0")
			{
				document.getElementById('show').focus();
				return false;
			}
			if($scope.date == "initial")
			{
				document.getElementById('date').focus();
				return false;
			}
			if($scope.noOfSeats == "0")
			{
				document.getElementById('noOfSeats').focus();
				return false;
			}
			$rootScope.movie = $scope.movie;
			$rootScope.theatre = $scope.theatre;
			$rootScope.show = $scope.show;
			$rootScope.date = $scope.date;
			$rootScope.noOfSeats = $scope.noOfSeats;
			window.location = '#/bookSeats';

		}

		function checkAvailabilityFn(){
			var req = {
				method : 'GET',
				url : '/previousTransaction',
				params : {
					movie : $scope.movie,
					theatre : $scope.theatre,
					show : $scope.show,
					date : $scope.date
				}
			};
			$http(req).then(successCheckAvailability, function(res){
				console.log("An error occured in checking the availabilty");
			});
		}

		function checkSeatsFn(){

			var req = {
				meyhod : 'GET',
				url : '/previousTransaction',
				params : {
					movie : $scope.movie,
					theatre : $scope.theatre,
					show : $scope.show,
					date : $scope.date,
				}
			};
			$http(req).then(successCheckSeats, function(res){
				console.log("An error occured in checkSeatsFn in HomeController");
			});
		}

		function successCheckSeats(res){
			var seats = res.data.split(',');
			var count = seats.length - 1;
			var available = 260 - count ;
			if($scope.noOfSeats > available)
			{
				$scope.flag1 = true;
			}
		}



		function successCheckAvailability(res){
			$scope.flag = true;
			var seats = res.data.split(',');
			var count = seats.length - 1;
			$scope.available = 260 - count;
			if($scope.available == 0)
			{
				$scope.message = "Sorry!! The theatre room is already full. Better Luck nect time!";
				//window.location = '/#';
				$scope.temp = true;
			}
			else
			{
				$scope.message = "Hurry!! The seats are filling fast.";
			}
		}

		function checkTempFn(){
			if($scope.temp == true || $scope.flag1 == true)
				return true;
			else
				return false;
		}
		$scope.getLanguages();
	}
})();