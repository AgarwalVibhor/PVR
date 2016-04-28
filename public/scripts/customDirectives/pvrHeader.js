(function(){

	'use strict';
	angular.module('PVRCinemas').directive('pvrHeader', pvrHeader);

	function pvrHeader(){
		return {
			restrict : 'E',
			templateUrl : './views/pvr-header.html'
		}
	}
})();