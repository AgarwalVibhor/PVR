(function(){

	'use strict';
	angular.module('PVRCinemas').controller('ConfirmTicketController', ConfirmTicketController);

	ConfirmTicketController.$inject = ['$scope', '$http', '$rootScope'];
	function ConfirmTicketController($scope, $http, $rootScope){

		if((!$rootScope.final_movie) || (!$rootScope.final_theatre) || (!$rootScope.final_show) || (!$rootScope.final_date) || (!$rootScope.final_seats))
		{
			window.location = '#/';
		}

		$scope.addDetails = addDetailsFn;

		function addDetailsFn(){

			var req = {
				method : 'POST',
				url : '/addDetails',
				data : {
					movie : $rootScope.movie,
					theatre : $rootScope.theatre,
					show : $rootScope.show,
					date : $rootScope.date,
					noOfSeats : $rootScope.noOfSeats,
					seats : $rootScope.final_seats
				}
			};
			$http(req).then(successAddDetails, function(res){
				console.log("An error occured while adding the data to the database file");
			});
		}

		function successAddDetails(res){
			console.log("Data inserted successfully- from ConfirmTicketController");
		}
		$scope.addDetails();
	}
})();