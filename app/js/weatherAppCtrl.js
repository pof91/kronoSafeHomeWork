'use strict';

var Distance,handle_errors;
function WeatherAppCtrl($scope,queryWeather, queryCity) {
	$scope.citySelect = {
        value: '',
        zmw : ''
    };
    $scope.cityRequest = queryCity;
	$scope.predicate = "distance";
	$scope.buttonIsVisible = false;
	$scope.isVisible = false;
	$scope.chooseCity = function(){
		$scope.wS = [];
		if ($scope.citySelect.value !== ''){
			try {
            	queryWeather.AutoComplete(
            		{'location':'zmw:' + $scope.citySelect.zmw,'interet':'geolookup'},
                	function(data) {
                   		$scope.wS = data;
                	}
                );
			    $scope.buttonIsVisible = true;	
        	} catch (ex) {
        		console.log(ex);
        		$scope.buttonIsVisible = false;
        	}
		}else{
				$scope.buttonIsVisible = false;
		}
	}
	$scope.updateConditions = function(station) {
		var location ;
		$scope.conditions = [];
		if ('pws' in station) location = 'pws:' + station.pws;
		else if ('lat' in station) location = station.lat;
		else location = 'icao:' + station.icao;
		try {
            queryWeather.AutoComplete(
            	{'location' : location},
                function(data) {
                    $scope.conditions = data;
                });
            $scope.isVisible = true;
        } catch (ex) {
        	console.log(ex);
        	$scope.isVisible = false;
        }
	};
	$scope.geoCity = function(){
	    if (Modernizr.geolocation) {
	        navigator.geolocation.getCurrentPosition($scope.getLuckyWeather, handle_errors);
	    } else {
	        alert("Geolocation Not Supported! ");
	    }
	}
	$scope.getLuckyWeather = function(position) {
    	var wu_query = position.coords.latitude + ',' + position.coords.longitude;
    	$scope.updateConditions({lat : wu_query});
	}


}
 

Distance = function(lat_a_degre, lon_a_degre, lat_b_degre, lon_b_degre){
	var R = 6378000 //Rayon de la terre en metre
	var lat_a = (Math.PI * lat_a_degre) /180;
	var lon_a = (Math.PI * lon_a_degre) /180;
	var lat_b = (Math.PI * lat_b_degre) /180;
	var lon_b = (Math.PI * lon_b_degre)/180;
	var d = R * (Math.PI/2 - Math.asin( Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a)))
	return parseInt(d);
}

handle_errors = function(error) {
    switch (error.code) {
    case error.PERMISSION_DENIED:
        alert("user did not share geolocation data");
        break;

    case error.POSITION_UNAVAILABLE:
        alert("could not detect current position");
        break;

    case error.TIMEOUT:
        alert("retrieving position timedout");
        break;

    default:
        alert("unknown error");
        break;
    }
}



