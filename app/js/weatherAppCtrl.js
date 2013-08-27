'use strict';

var Distance,handle_errors;
function WeatherAppCtrl($scope,queryWeather, queryCity) {
	$scope.citySelect = {value: '',zmw : ''};
    $scope.cityRequest = queryCity;
	$scope.predicate = "distance";
	$scope.visible = false;
	$scope.first = false;
	$scope.wS = {visible : false, data : []};
	$scope.selected = 0;
    $scope.history = [];
	$scope.chartData = [];
	$scope.chooseCity = function(){
        $scope.wS = queryWeather.AutoComplete(
            {'location':'zmw:' + $scope.citySelect.zmw,'interet':'geolookup'}
        );	
	}
	$scope.updateConditions = function(station) {
		var location ;
		$scope.visible = false;
		if ('pws' in station) location = 'pws:' + station.pws;
		else if ('lat' in station) location = station.lat;
		else location = 'icao:' + station.icao;
        $scope.queryWeather = queryWeather.AutoComplete({'location' : location});
		$scope.queryWeather.then(function (value) {
			$scope.history.push(value.data);
			$scope.chartData.push([angular.lowercase(value.data.location).split(',')[0],value.data.temperature]);
			$scope.selected = $scope.history.length - 1;
			$scope.visible = true;
			$scope.first = true;
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
	$scope.what = function(param,sta) {
		if (param == $scope.selected){
			$scope.stationSel = sta;
			return true;
		}
        return false;
    };
	$scope.chooseGraph = function(what){
		$scope.chart = what;
	}
}