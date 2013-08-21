angular.module('appWeatherServices', ['ngResource']).
    factory('queryWeather', function($resource){
		return $resource('http://api.wunderground.com/api/ea5af3a442586762/:interet/q/:pays/:location.json',
			{interet:'@interet',pays:'@pays',location:'@location',callback: 'JSON_CALLBACK'}, 
			{query: {method: 'JSONP',responseType:"json", isArray:false}});
	});