'use strict';
google.setOnLoadCallback(function() {
  angular.bootstrap(document.body, ['appWeather']);
});
google.load('visualization', '1', {packages: ['corechart']});
var appWeather = angular.module('appWeather',['appWeatherServices']);