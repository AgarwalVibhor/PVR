(function(){

	'use strict';
	angular.module('PVRCinemas').controller('BookSeatsController', BookSeatsController);

	BookSeatsController.$inject = ['$http', '$scope', '$rootScope'];
	function BookSeatsController($http, $scope, $rootScope){

		if((!$rootScope.movie) || (!$rootScope.theatre) || (!$rootScope.show) || (!$rootScope.date) || (!$rootScope.noOfSeats))
			window.location = '#/';

		$scope.getNames = getNamesFn;
		$scope.selectedSeats = selectedSeatsFn;
		$scope.confirmTicket = confirmTicketFn;
		$scope.previousTransaction = previousTransactionFn;
		$scope.cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		$scope.rows = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		$scope.selectedSeatsList = [];
		$scope.totalPrice = 0.00;
		var seatCount = 0;
		var price = 80.00;
		function getNamesFn(){

			var req = {
				method : 'GET',
				url : '/getNames',
				params : {
					movie : $rootScope.movie,
					theatre : $rootScope.theatre,
					show : $rootScope.show,
					date : $rootScope.date
				}
			};
			$http(req).then(successGetNames, function(res){
				console.log("An error occured in retreiving the names in BookSeatsController");
			});
		}

		function successGetNames(res){
			$scope.movie = res.data.movie;
			$scope.theatre = res.data.theatre;
			$scope.show = res.data.show;
			$scope.date = res.data.date;
		}

		function selectedSeatsFn(seatId){

			if(!$("#seatTd" + seatId).hasClass('color-10'))
			{
				if(($scope.selectedSeatsList.indexOf(seatId) != -1) && (seatCount < ($rootScope.noOfSeats + 1)))
				{
					$scope.selectedSeatsList.splice($.inArray(seatId, $scope.selectedSeatsList), 1);
					seatCount = seatCount - 1;
					$("#seatTd" + seatId).removeClass();
					$("#seatTd" + seatId).addClass('color-0');
				}
				else if(($scope.selectedSeatsList.indexOf(seatId) == -1) && (seatCount < $rootScope.noOfSeats))
				{
					$scope.selectedSeatsList.push(seatId);
					seatCount = seatCount + 1;
					$("#seatTd" + seatId).removeClass();
					$("#seatTd" + seatId).addClass('color-9');
				}
				$scope.seats = $scope.selectedSeatsList.toString();
				$scope.totalPrice = seatCount * price;
			}
			else
			{
				return false;
			}
		}

		function confirmTicketFn(){
			$rootScope.final_movie = $scope.movie;
			$rootScope.final_theatre = $scope.theatre;
			$rootScope.final_show = $scope.show;
			$rootScope.final_date = $scope.date;
			$rootScope.final_seats = $scope.seats;
			$rootScope.final_price = $scope.totalPrice;

			window.location = '#/confirmTicket';
		}

		function previousTransactionFn(){

			var req = {
				method : 'GET',
				url : '/previousTransaction',
				params : {
					movie : $rootScope.movie,
					theatre : $rootScope.theatre,
					show : $rootScope.show,
					date : $rootScope.date
				}
			};
			$http(req).then(successGetPreviousTransaction, function(res){
				console.log("An error occured in the previous transaction ");
			});
		}

		function successGetPreviousTransaction(res){
			var seatsList = res.data.split(',');
			for(var i = 0; i < (seatsList.length - 1); i++)
			{
				$("#seatTd" + seatsList[i]).removeClass();
				$("#seatTd" + seatsList[i]).addClass('color-10');
			}
		}

		$scope.getNames();
		$scope.previousTransaction();
	}
})();