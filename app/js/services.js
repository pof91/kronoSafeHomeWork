'use strict';

angular.module('appWeatherServices', []).
    factory('queryWeather', function($q,$http){
    	return {
			AutoComplete: function(request) {
			    var promiseStart = $q.when('start');
				var url, retour,features, query;
				var promise = promiseStart.then(function (value) {
					if (request.interet === 'geolookup') features = 'geolookup';
					else  features = 'conditions/forecast10day/hourly';
					query = features + '/q/' + request.location + '.json';
					url = 'http://api.wunderground.com/api/ea5af3a442586762/' + query+'?callback=JSON_CALLBACK';
					return $http.jsonp(url).
						success(function(data, status) {
							if (features === 'geolookup'){
								retour = [];
								var apiLoc = data.location;
								angular.forEach(apiLoc.nearby_weather_stations.airport.station, function(value,key){
									var distance = (Distance(apiLoc.lat,apiLoc.lon,value.lat,value.lon)/1000.0);
									if (distance < 40.0){
										retour.push({
											'city': angular.lowercase(value.city), 
											'icao' : value.icao, 
											'distance' : distance
										});
									}
								});
								angular.forEach(apiLoc.nearby_weather_stations.pws.station, function(value,key){
									var distance = (Distance(apiLoc.lat,apiLoc.lon,value.lat,value.lon)/1000.0);
									if (distance < 40.0){
										retour.push({
											'city': angular.lowercase(value.city),
											'neighborhood': angular.lowercase(value.neighborhood),
											'pws' : value.id, 
											'distance' : distance
										});
									}
								});
							}
							else{
								var apiObs = data.current_observation;
								retour = {};
								retour = {
									location : angular.uppercase(apiObs.observation_location.full),
									lastUpdate : apiObs.observation_epoch * 1000,
									humidity : apiObs.relative_humidity,
									temperature : apiObs.temp_c,
									weatherIcon : 'img/' +apiObs.icon + '.gif',
									weather : apiObs.weather,
									feelslike : apiObs.feelslike_c,
									uv : apiObs.UV,
								};
							}
						});
				});
				
				var promiseEnd = promise.then(function () {
					return {'visible' : true, 'data' : retour} ;
				}, function (reason) {
					return $q.reject(reason);
				});
				return promiseEnd; 
			}
		}
	}).factory('queryCity', function($http) {
		return {
			AutoComplete: function(request, response) {
				var retour, dataToPost, config;
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
					retour = data.RESULTS.map(function(item) {
						return {
							label: item.name.substring(0,item.name.length-8),
							zmw: item.zmw
						}
					});
					response(retour);
				}).
				error(function(data, status, headers, config) {
					response([]);
				});

			}
		}
	});