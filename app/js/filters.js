'use strict';

appWeather.filter('capitalize', function() {
		return function(value) {
			return value.substring(0,1).toUpperCase()+value.substring(1);
		};
	});
	
appWeather.filter('lowerThanDistanceRange', function() {
		return function(tabStation,distanceRange) {
			var arr = [];
			if (tabStation) {
				for ( var i = tabStation.length; i--; ) {
					if ( tabStation[i].distance <= distanceRange ) {
						arr.push( tabStation[i] );
					}
				}
			}
            return arr;
		};
	});
	
appWeather.filter('degree', function($filter) {
    return function(input,CF) {
		if (CF === 'C')
			return input + '\u00B0C';
		else if (CF === 'F')
			return input + '\u00B0F';
		else
			return input + '\u00B0C';
    };
});