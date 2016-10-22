/**
 * Created by Alex on 2/7/2016.
 */

angular.module('wedding', ['ngRoute'])

    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'html/home.html'
            })
            /*.when('/rsvp', {
             controller: 'rsvpController',
             templateUrl: 'html/rsvp.html'
             })/**/// uncomment when RSVP ready.
            .when('/events', {
                templateUrl: 'html/events.html'
            })
            .when('/party', {
                templateUrl: 'html/party.html'
            })
            .when('/bloomington', {
                templateUrl: 'html/bloomington.html'
            })
            .when('/travel', {
                templateUrl: 'html/travel.html'
            })
            .when('/registry', {
                templateUrl: 'html/registry.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    })

    .controller('navController', function NavController($scope) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === window.location.hash;
        };
    })

    .controller('rsvpController', function ($scope) {
        $scope.populateGuests = function () {
            var old = $scope.guestNames;
            $scope.guestNames = [];

            for (var i = 0; i < $scope.guestsNo; i++) {
                if (old[i] === undefined) {
                    $scope.guestNames.push({});
                } else {
                    $scope.guestNames.push(old[i]);
                }
            }

            return $scope.guestNames;
        };

        $scope.validateAndSubmit = function () {
            var outObj = {
                name: $scope.name,
                attendance: $scope.attendance,
                guests: []
            };

            for (var i = 0; i < $scope.guestsNo; i++) {
                outObj.guests.push($scope.guestNames[i].name);
            }

            console.log(outObj);
        }
    })

    .directive('place', function () {
        function createLink(address, zip) {
            return encodeURIComponent(address + ", Bloomington, IN " + zip);
        }

        return {
            transclude: true,
            restrict: 'E',
            templateUrl: 'html/place.html',
            scope: {
                name: '@',
                address: '@',
                zip: '@',
                maplink: '@',
                href: '@'
            },
            link: function (scope, element, attrs) {
                scope.name = attrs.name;
                scope.address = attrs.address;
                scope.zip = attrs.zip;
                scope.href = attrs.href;
                scope.maplink = createLink(scope.address, scope.zip);
            }
        }
    })

    .directive('person', function () {
        return {
            transclude: true,
            restrict: 'E',
            templateUrl: 'html/person.html',
            scope: {
                name: '@'
            },
            link: function (scope, element, attrs) {
                scope.name = attrs.name;
            }
        }
    })

    .directive('navigation', function () {
        return {
            controller: 'navController',
            transclude: true,
            restrict: 'E',
            templateUrl: 'html/nav.html'
        }
    });

