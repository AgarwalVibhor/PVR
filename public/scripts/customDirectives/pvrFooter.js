(function(){

	'use strict';
	angular.module('PVRCinemas').directive('pvrFooter', pvrFooter);

	function pvrFooter(){
		return {
			restrict : 'E',
			templateUrl : './views/pvr-footer.html'   // dash in HTML translates to camelCase in Javascript. Therefore pvr-header to pvrHeader.
		};
	}
})();