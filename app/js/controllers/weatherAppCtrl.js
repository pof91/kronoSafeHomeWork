'use strict';
var Conditions
appWeather.controller('weatherAppCtrl', function ($scope,$resource) {
	//creation de la requete
	var methods = {callback: 'JSON_CALLBACK'};
	var option = {get: {method: 'JSONP'}};
	var api = $resource('http://api.wunderground.com/api/fdb61d8a3c1e4be4/geolookup/conditions/forecast/q/France/:location.json', methods, option);
	var requeteFct = function(location, onSuccess, onError) {
					return api.get({location: location}, onSuccess, onError);
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