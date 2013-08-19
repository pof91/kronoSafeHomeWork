'use strict';
var Conditions,WeatherStations;
appWeather.controller('weatherAppCtrl', function ($scope,$resource) {
	//creation de la requete
	//geolookup/conditions/forecast
	var methods = {callback: 'JSON_CALLBACK'};
	var option = {get: {method: 'JSONP'}};
	var api = $resource('http://api.wunderground.com/api/ea5af3a442586762/:interet/q/France/:location.json', methods, option);
	var requeteFct = function(location,interet, onSuccess, onError) {
					return api.get({location : location,interet : interet}, onSuccess, onError);
				};
	$scope.isVisible = false;
	$scope.greeting = "Hello world ! Please enter a city in the field";
	$scope.updateConditions = function() {
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
		};
		return requeteFct($scope.city, success);
	};
	$scope.updateCity = function(){
		var success = function(result) {
			var wS, response;
			response = result.response;
			if (response.error) {
			  $scope.greeting = "Sorry !! " + response.error.description +" : " +  $scope.city;
			  $scope.isVisible = false;
			  return $scope.wS = null;
			} 
			else {
				$scope.isVisible = true;
				$scope.wS = new WeatherStations(result);
				console.log($scope.wS);
				return $scope.city = $scope.wS.city;
			}
		};
		return requeteFct($scope.city,'geolookup', success);
	}
	
	$scope.distance = function(lat_a_degre, lon_a_degre, lat_b_degre, lon_b_degre){
     
		var R = 6378000 //Rayon de la terre en mètre
		var lat_a = (Math.PI * lat_a_degre) /180;
		var lon_a = (Math.PI * lon_a_degre) /180;
		var lat_b = (Math.PI * lat_b_degre) /180;
		var lon_b = (Math.PI * lon_b_degre)/180;
		var d = R * (Math.PI/2 - Math.asin( Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a)))
		return parseInt(d);
	}
});
 



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

WeatherStations = function WeatherStations(apiResponse) {
  var apiLoc = apiResponse.location;
  this.city = apiLoc.city;
  this.lat = apiLoc.lat;
  this.lon = apiLoc.lon;
  this.wSAirports = apiLoc.nearby_weather_stations.airport.station;
  this.wSPws = apiLoc.nearby_weather_stations.pws.station;
}