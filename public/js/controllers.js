'use strict';

angular.module('shippableApp.controllers', ['shippableApp.services'])
        .controller('AppCtrl', ['$scope', 'ShippableService', function ($scope, ShippableService) {
                $scope.appName = "Shippable";
                $scope.showIssues = function () {
                    if ($scope.repoName.indexOf('github.com') === -1) {
                        alert("Not a github repo");
                    } else if ($scope.repoName.split('/').length !== 5) {
                        alert("Invalid github repo");
                    } else {
                        var ar = $scope.repoName.split('/');
                        ShippableService.fetchIssues(ar[3], ar[4]).then(function (response) {
                            $scope.issues = response.data.filter(function(issue){
                                return issue.state === 'open';
                            });
                            $scope.last24Hours = ShippableService.filter24Hours($scope.issues);
                            $scope.last7Days = ShippableService.filterLast7Days($scope.issues);
                            $scope.moreThan7Days = ShippableService.filterMoreThan7Days($scope.issues);
                        }, function (response) {
                            console.error(response);
                        });
                    }
                };
            }]);