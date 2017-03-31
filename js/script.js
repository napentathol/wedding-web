/**
 * Created by Alex on 2/7/2016.
 */

angular.module('wedding', ['ngRoute'])

    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'html/home.html'
            })
            .when('/the-big-day', {
                templateUrl: 'html/the-big-day.html'
            })
            .when('/how-we-met', {
                templateUrl: 'html/how-we-met.html'
            })
            .when('/accommodations', {
                templateUrl: 'html/accommodations.html'
            })
            .when('/local-favorites', {
                templateUrl: 'html/local-favorites.html'
            })
            .when('/registry', {
                templateUrl: 'html/registry.html'
            })
            .when('/rsvp', {
                 controller: 'rsvpController',
                 templateUrl: 'html/rsvp.html'
             })
            .otherwise({
                redirectTo: '/'
            });
    })

    .controller('navController', function NavController($scope) {
        $scope.mobileMenuVisible = false;
        $scope.toggleMobileView = function () {
            $scope.mobileMenuVisible = !$scope.mobileMenuVisible;
        };
    })

    .controller('rsvpController', function ($scope, $http) {
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
            $scope.success = null;
            if( !$scope.firstName )
            {
                $scope.warning = "Must add your first name.";
                return;
            }
            if( !$scope.lastName )
            {
                $scope.warning = "Must add your last name.";
                return;
            }
            if( !$scope.attendance )
            {
                $scope.warning = "Must set attendance";
                return;
            }

            var outObj = {
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                attendance: $scope.attendance,
                guests: [],
                qcc: $scope.qcc
            };

            for (var i = 0; i < $scope.guestsNo; i++) {
                if( !$scope.guestNames[i].firstName )
                {
                    $scope.warning = "Must add first name for guest " + i;
                    return;
                }
                if( !$scope.guestNames[i].lastName )
                {
                    $scope.warning = "Must add last name for guest " + i;
                    return;
                }

                outObj.guests.push({
                    firstName: $scope.guestNames[i].firstName,
                    lastName: $scope.guestNames[i].lastName
                });
            }

            console.log("Sending data...");
            console.log(outObj);
            $http.post( wedding.api.endpoint, outObj ).then(
                function success( response ) {
                    $scope.warning = null;
                    $scope.success = response.data;
                    console.log( response.data );
                    console.log("data sent!")
                },
                function error( response ) {
                    if( response.data ) {
                        $scope.warning = "Failed to complete request, if this continues contact Alex: " + response.data;
                    } else {
                        $scope.warning = "Failed to complete request, if this continues contact Alex."
                    }
                    console.error( response.data );
                    console.error( "data failed to send!" )
                }
            );
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
                href: '@',
                phone: '@'
            },
            link: function (scope, element, attrs) {
                scope.name = attrs.name;
                scope.address = attrs.address;
                scope.zip = attrs.zip;
                scope.href = attrs.href;
                scope.phone = attrs.phone;
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

