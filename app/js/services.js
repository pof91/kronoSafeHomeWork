angular.module('appWeatherServices', ['ngResource']).
    factory('queryWeather', function($resource){
		return $resource('http://api.wunderground.com/api/ea5af3a442586762/:interet/q/France/:location.json',
			{interet:'@interet', location:'@location',callback: 'JSON_CALLBACK'}, 
			{query: {method: 'JSONP',responseType:"json", isArray:false}});
	});