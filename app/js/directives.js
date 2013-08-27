'use strict';

appWeather.directive('myAutocomplete', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            minInputLength: '@minInput',
            remoteData: '&',
            placeholder: '@placeholder',
            restrictCombo: '@restrict',
            citySelect: '=citySelect'
        },
        templateUrl: 'template/autocomplete.html',
        controller: function($scope, $element, $attrs) {
            $scope.selectMe = function(choice) {
                $scope.citySelect = choice;
                $scope.searchTerm = $scope.lastSearchTerm = choice.label;
            };
            $scope.UpdateSearch = function() {
                if ($scope.searchTerm && $scope.canRefresh()) {
                    $scope.searching = true;
                    $scope.lastSearchTerm = $scope.searchTerm;
                    try {
                        $scope.remoteData({
                            request:  $scope.searchTerm,
                            response: function(data) {
                                $scope._choices = data;
                                $scope.searching = false;
                            }
                        });
                    } catch (ex) {
                        console.log(ex.message);
                        $scope.searching = false;
                    }
                }
            }
            $scope.$watch('searchTerm', $scope.UpdateSearch);
            $scope.canRefresh = function() {
                return ($scope.searchTerm.length > $scope.minInputLength) && ($scope.searchTerm !== "") && ($scope.searchTerm !== $scope.lastSearchTerm) && ($scope.searching != true);
            };
           /* $scope.checkKeyCode = function($event){
                if ($event.keyCode === 13){
                    $scope.chooseCity();
                }
             }*/
        },
       link: function(scope, iElement, iAttrs, controller) {
            scope._searchTerm = '';
            scope._lastSearchTerm = '';
            scope.searching = false;
            scope._choices = [];
            if (iAttrs.restrict == 'true') {
                var searchInput = angular.element(iElement.children()[0])
                searchInput.bind('blur', function() {
                    if (scope._choices.indexOf(scope.citySelect) < 0) {
                        scope.citySelect = {value: '', zmw : ''};
                        scope.searchTerm = '';
                    }
                });
            }
        }
    };
});

appWeather.directive("focused", function($timeout) {
    return function(scope, element, attrs) {
        element[0].focus();
        element.bind('focus', function() {
            scope.$apply(attrs.focused + '=true');
        });
        element.bind('blur', function() {
            $timeout(function() {
                scope.$eval(attrs.focused + '=false');
            }, 200);
        });
        scope.$eval(attrs.focused + '=true')
    }
});

appWeather.directive('lineChart', function ($timeout) {
  return {
    restrict: 'EA',
    scope: {
      title:    '@title',
      width:    '@width',
      height:   '@height',
      data:     '=data',
      selectFn: '&select'
    },
    link: function($scope, $elm, $attr) {
      
      // Create the data table and instantiate the chart
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'City');
      data.addColumn('number', 'history');
      var chart = new google.visualization.LineChart($elm[0]);

      draw();
      
      // Watches, to refresh the chart when its data, title or dimensions change
      $scope.$watch('data', function() {
        draw();
      }, true); // true is for deep object equality checking

      // Chart selection handler
      google.visualization.events.addListener(chart, 'select', function () {
        var selectedItem = chart.getSelection()[0];
        if (selectedItem) {
          $scope.$apply(function () {
            $scope.selectFn({selectedRowIndex: selectedItem.row});
          });
        }
      });
        
      function draw() {
        if (!draw.triggered) {
          draw.triggered = true;
          $timeout(function () {
            draw.triggered = false;
            var label, value;
            data.removeRows(0, data.getNumberOfRows());
            angular.forEach($scope.data, function(row) {
              label = row[0];
              value = parseFloat(row[1], 10);
                data.addRow([row[0], value]);
            });
            var options = {
                        curveType: "function", 
                        pointSize: 5,
                        title: $scope.title,
                        width: $scope.width,
                        height: $scope.height,
                        vAxis: {title: "Temperature"},
                        hAxis: {title: "City",slantedTextAngle : 30},
                        animation: {
                            duration: 1000,
                            easing: 'out'
                        }
                };
            chart.draw(data, options);
          }, 0, true);
        }
      }
    }
  };
});

appWeather.directive('lineHourly', function ($timeout) {
  return {
    restrict: 'EA',
    scope: {
      title:    '@title',
      width:    '@width',
      height:   '@height',
      data:     '=data'
    },
    link: function($scope, $elm, $attr) {
      // Create the data table and instantiate the chart
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'hour');
      data.addColumn('number', 'temp');
      var chart = new google.visualization.LineChart($elm[0]);

      draw();
      
      // Watches, to refresh the chart when its data, title or dimensions change
      $scope.$watch('data', function() {
        draw();
      }, true); // true is for deep object equality checking
        
      function draw() {
        if (!draw.triggered) {
          draw.triggered = true;
          $timeout(function () {
            draw.triggered = false;
            var label, value;
            data.removeRows(0, data.getNumberOfRows());
            angular.forEach($scope.data, function(row) {
              label = row[2];
              value = parseFloat(row[1], 10);
                data.addRow([row[0], value]);
            });
            var options = {
                        curveType: "function", 
                        pointSize: 1,
                        title: $scope.title,
                        width: $scope.width,
                        height: $scope.height,
                        vAxis: {title: "Temperature"},
                        hAxis: {title: "Hour",slantedTextAngle : 30},
                        animation: {
                            duration: 1000,
                            easing: 'out'
                        }
                };
            chart.draw(data, options);
          }, 0, true);
        }
      }
    }
  };
});

appWeather.directive('lineDaily', function ($timeout) {
  return {
    restrict: 'EA',
    scope: {
      title:    '@title',
      width:    '@width',
      height:   '@height',
      data:     '=data'
    },
    link: function($scope, $elm, $attr) {
      // Create the data table and instantiate the chart
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'day');
      data.addColumn('number', 'tempMax');
	  data.addColumn({type : 'string', role : 'tooltip'})
	  data.addColumn('number', 'tempMin');
	  data.addColumn({type : 'string', role : 'tooltip'})
      var chart = new google.visualization.AreaChart($elm[0]);

      draw();
      
      // Watches, to refresh the chart when its data, title or dimensions change
      $scope.$watch('data', function() {
        draw();
      }, true); // true is for deep object equality checking
        
      function draw() {
        if (!draw.triggered) {
          draw.triggered = true;
          $timeout(function () {
            draw.triggered = false;
            var label, value1, value2;
            data.removeRows(0, data.getNumberOfRows());
            angular.forEach($scope.data, function(row) {
              label = row[0];
              value1 = parseFloat(row[1], 10);
			  value2 = parseFloat(row[2], 10);
              data.addRow([row[0], value1, row[3], value2, row[3]]);
            });
            var options = {
			    allowHtml : true,
				displayAnnotations : true,
				colors : ['#FF7905','#351EFF'],
				curveType: "function", 
				pointSize: 0,
				title: $scope.title,
				width: $scope.width,
				height: $scope.height,
				vAxis: {title: "Temperatures"},
				hAxis: {title: "Days",slantedTextAngle : 30},
				animation: {
					duration: 1000,
					easing: 'out'
				},
                };
            chart.draw(data, options);
          }, 0, true);
        }
      }
    }
  };
});