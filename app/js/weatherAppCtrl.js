'use strict';

var Distance,handle_errors;
function WeatherAppCtrl($scope,queryWeather, queryCity) {
	$scope.citySelect = {value: '',zmw : ''};
    $scope.cityRequest = queryCity;
	$scope.predicate = "distance";
	$scope.wS = {visible : false, data : []};
	$scope.conditions = {visible : false, data : {}};
    $scope.history = [];
	$scope.chartData = [];
	$scope.chooseCity = function(){
        $scope.wS = queryWeather.AutoComplete(
            {'location':'zmw:' + $scope.citySelect.zmw,'interet':'geolookup'}
        );	
	}
	$scope.updateConditions = function(station) {
		var location ;
		if ('pws' in station) location = 'pws:' + station.pws;
		else if ('lat' in station) location = station.lat;
		else location = 'icao:' + station.icao;
		$scope.conditions = {visible : false, data : {}};
        $scope.queryWeather = queryWeather.AutoComplete({'location' : location});
		$scope.queryWeather.then(function (value) {
			$scope.history.push(value.data);
			$scope.chartData.push([angular.lowercase(value.data.location).split(',')[0],value.data.temperature])
			$scope.conditions.data = value.data;
			$scope.conditions.visible = value.visible;
		});
	}
	$scope.geoCity = function(){
	    if (Modernizr.geolocation) {
	        navigator.geolocation.getCurrentPosition(
			function(position) {
				$scope.updateConditions({lat : position.coords.latitude + ',' + position.coords.longitude});
			}, handle_errors);
	    } else {
	        alert("Geolocation Not Supported! ");
	    }
	}
  	$scope.selectRow = function (index) {
    	$scope.selected = index;	
  	};
}