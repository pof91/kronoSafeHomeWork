'use strict';

angular.module('appWeatherServices', []).
    factory('queryWeather', function($http){
    	return {
			AutoComplete: function(request, response) {
				var retArray, dataToPost, config, features, query;
				if (request.interet === 'geolookup') features = 'geolookup';
				else  features = 'conditions/forecast10day/hourly';
				query = features + '/q/' + request.location + '.json';
				config = {
					method: 'JSONP',
					params : {callback: 'JSON_CALLBACK'},
					url: 'http://api.wunderground.com/api/ea5af3a442586762/' + query,
				};
				$http.jsonp(config.url, config).
				success(function(data, status, headers, config) {
					if (features === 'geolookup'){
						retArray = []
						var apiLoc = data.location;
						angular.forEach(apiLoc.nearby_weather_stations.airport.station, function(value,key){
							var distance = (Distance(apiLoc.lat,apiLoc.lon,value.lat,value.lon)/1000.0);
							if (distance < 40.0){
								retArray.push({
									'city': angular.lowercase(value.city), 
									'icao' : value.icao, 
									'distance' : distance
								});
							}
						});
						angular.forEach(apiLoc.nearby_weather_stations.pws.station, function(value,key){
							var distance = (Distance(apiLoc.lat,apiLoc.lon,value.lat,value.lon)/1000.0);
							if (distance < 40.0){
								retArray.push({
									'city': angular.lowercase(value.city),
									'neighborhood': angular.lowercase(value.neighborhood),
									'pws' : value.id, 
									'distance' : distance
								});
							}
						});
					}
					else{
						var retour = data.current_observation;
						retArray = [{
							location : angular.uppercase(retour.observation_location.full),
							lastUpdate : retour.observation_epoch * 1000,
							humidity : retour.relative_humidity,
							temperature : retour.temp_c,
							weatherIcon : retour.icon_url,
							weather : retour.icon
						}];
					}
					response(retArray);
				}).
				error(function(data, status, headers, config) {
					response([]);
				});

			}
		}
	}).factory('queryCity', function($http) {
		return {
			AutoComplete: function(request, response) {
				var retArray, dataToPost, config;
				dataToPost = {
					query : request,
					c : "FR",
					h : '0',
					cb: 'JSON_CALLBACK'
				};
				config = {
					method: 'JSONP',
					url: 'http://autocomplete.wunderground.com/aq',
					params: dataToPost
				};
				$http.jsonp(config.url, config).
				success(function(data, status, headers, config) {
					retArray = data.RESULTS.map(function(item) {
						return {
							label: item.name.substring(0,item.name.length-8),
							zmw: item.zmw
						}
					});
					response(retArray);
				}).
				error(function(data, status, headers, config) {
					response([]);
				});

			}
		}
	});