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
                if ($scope.canRefresh()) {
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
                return ($scope.searchTerm !== "") && ($scope.searchTerm !== $scope.lastSearchTerm) && ($scope.searching != true);
            };
            $scope.checkKeyCode = function($event){
                if ($event.keyCode === 13){
                    $scope.chooseCity();
                }
             }
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