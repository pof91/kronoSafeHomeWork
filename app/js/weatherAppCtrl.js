'use strict';
var Distance;
function WeatherAppCtrl($scope,queryWeather) {
	$scope.greeting = "Hello world ! Please enter a city in the field";
	$scope.reverseCity = false;
	$scope.reverseDistance = false;
	$scope.predicate = "distance";
	$scope.isVisible = false;
	$scope.distanceRange = 40;
	$scope.checkKeyCode =function($event){
		if ($event.keyCode === 13){
			$scope.chooseCity();
		}
	}
	$scope.lowerThanDistanceRange = function(item){
		return item.distance <= $scope.distanceRange;
	}
	$scope.chooseCity = function(){
		$scope.wS = [];
		var result = queryWeather.query({location:$scope.citySelect,pays:'France',interet:'geolookup'},
			function(result) {
				var response = result.response;
				if (response.error) {
					$scope.greeting = "Sorry !! " + response.error.description;
					return $scope.wS = null;
				}
				else {
					var apiLoc = result.location;
					angular.forEach(apiLoc.nearby_weather_stations.airport.station, function(value,key){
						var distance = (Distance(apiLoc.lat,apiLoc.lon,value.lat,value.lon)/1000.0);
						if (distance < 40.0){
							$scope.wS.push({
								'city': angular.lowercase(value.city), 
								'icao' : value.icao, 
								'distance' : distance
							});
						}
					});
					angular.forEach(apiLoc.nearby_weather_stations.pws.station, function(value,key){
						var distance = (Distance(apiLoc.lat,apiLoc.lon,value.lat,value.lon)/1000.0);
						if (distance < 40.0){
							$scope.wS.push({
								'city': angular.lowercase(value.city),
								'neighborhood': angular.lowercase(value.neighborhood),
								'pws' : value.id, 
								'distance' : distance
							});
						}
					});
					$scope.greeting = "Great !! I found " + $scope.wS.length + " stations, Pick one";
				}
			}
		);
	}
	$scope.updateConditions = function(station) {
		$scope.conditions = [];
		var location = "";
		if ('pws' in station) location = 'pws:' + station.pws;
		else location = 'icao:' + station.icao;
		var result = queryWeather.query({location:location,pays:'',interet:'conditions'},
			function(result) {
				var response = result.current_observation;
				$scope.conditions.push({
					'location' : angular.uppercase(response.observation_location.full),
					'lastUpdate' : response.observation_time_rfc822,
					'humidity' : response.relative_humidity,
					'temperature' : response.temp_c,
					'weatherIcon' : response.icon_url,
					'weather' : response.icon
				});
			}
		);
		$scope.isVisible = true;
	};
	


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

