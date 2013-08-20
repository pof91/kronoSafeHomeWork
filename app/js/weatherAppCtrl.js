'use strict';
var Conditions,Distance;
function WeatherAppCtrl($scope,queryWeather) {
	$scope.isVisible = false;
	$scope.greeting = "Hello world ! Please enter a city in the field";
	/*$scope.updateConditions = function() {
		var success = function(result) {
			var conditions, response;
			response = result.response;
			if (response.error) {
			  $scope.greeting = "Sorry !! " + response.error.description +" : " +  $scope.city;
			  $scope.isVisible = false;
			  return $scope.conditions = null;
			} 
			else {
				$scope.isVisible = true;
				$scope.conditions = new Conditions(result);
				return $scope.city = $scope.conditions.city;
			}
		//};
		//return Query.query(success);
	};*/
	$scope.chooseCity = function(){
		$scope.wS = [];
		var result = queryWeather.query({location:$scope.citySelect,interet:'geolookup'},
			function(result) {
				var response = result.response;
				if (response.error) {
					$scope.greeting = "Sorry !! " + response.error.description +" : " +  $scope.citySelect;
					$scope.isVisible = false;
					return $scope.wS = null;
				}
				else {
					var apiLoc = result.location;
					angular.forEach(apiLoc.nearby_weather_stations.airport.station, function(value,key){
						console.log(value.city +':' + value.icao +':' + value.lat +':' + value.lon);
						var distance = (Distance(apiLoc.lat,apiLoc.lon,value.lat,value.lon)/1000.0);
						if (distance < 40.0){
							$scope.wS.push({'city': angular.lowercase(value.city), 'icao' : value.icao, 'distance' : distance});
						}
					});
					angular.forEach(apiLoc.nearby_weather_stations.pws.station, function(value,key){
						console.log(value.city +':' + value.id +':' + value.lat +':' + value.lon);
						var distance = (Distance(apiLoc.lat,apiLoc.lon,value.lat,value.lon)/1000.0);
						if (distance < 40.0){
							$scope.wS.push({'city': angular.lowercase(value.city),'neighborhood': angular.lowercase(value.neighborhood),'pws' : value.id, 'distance' : distance});
						}
					});

					$scope.isVisible = true;
				}
			}
		);
	}
	


}
 

Distance = function(lat_a_degre, lon_a_degre, lat_b_degre, lon_b_degre){
     
		var R = 6378000 //Rayon de la terre en m?tre
		var lat_a = (Math.PI * lat_a_degre) /180;
		var lon_a = (Math.PI * lon_a_degre) /180;
		var lat_b = (Math.PI * lat_b_degre) /180;
		var lon_b = (Math.PI * lon_b_degre)/180;
		var d = R * (Math.PI/2 - Math.asin( Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a)))
		return parseInt(d);
	}

Conditions = function Conditions(apiResponse) {
  var co = apiResponse.current_observation;
  var fo = apiResponse.forecast;
  this.location = co.display_location.full;
  this.city = co.display_location.city;
  this.weather = co.weather;
  this.feels_like = co.feelslike_string;
  this.humidity = co.relative_humidity;
  this.windchill = co.windchill_string;
  this.windspeed = co.wind_mph;
  this.temperature = co.temp_c;
  this.weatherIcon = co.icon_url;
  this.fetchDate = new Date();
  this.foreCastText = fo.txt_forecast.forecastday;
}
