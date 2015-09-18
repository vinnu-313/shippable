'use strict';

angular.module('shippableApp.controllers', ['shippableApp.services'])
        .controller('AppCtrl', ['$q', '$scope', 'ShippableService', function ($q, $scope, ShippableService) {
                $scope.appName = "Shippable screening test ";
                $scope.showIssues = function () {
                    $scope.results = false;
                    if ($scope.repoName.indexOf('github.com') === -1) {
                        alert("Not a github repo");
                    } else if ($scope.repoName.split('/').length !== 5) {
                        alert("Invalid github repo");
                    } else {
                        var ar = $scope.repoName.split('/');
                        ShippableService.fetchIssues(ar[3], ar[4], 1).then(function (response) {
                            var iterations = Math.ceil(response.data.total_count / 100);
                            $scope.issues = response.data.items;
                            var promises = [];
                            for(var i = 1; i < iterations; ++i){
                                promises.push(ShippableService.fetchIssues(ar[3], ar[4], i+1));
                            }
                            if(promises.length){
                                $q.all(promises).then(function(data){
                                    for(i = 0; i< iterations-1; ++i){
                                        console.log(data[i].data.items);
                                        $scope.issues = $scope.issues.concat(data[i].data.items);
                                    }
                                    console.info($scope.issues.length);
                                    $scope.last24Hours = ShippableService.filter24Hours($scope.issues);
                                    $scope.last7Days = ShippableService.filterLast7Days($scope.issues);
                                    $scope.moreThan7Days = ShippableService.filterMoreThan7Days($scope.issues);
                                    $scope.results = true;
                                }, function(error){
                                    console.error(error);
                                });    
                            } else {
                                $scope.last24Hours = ShippableService.filter24Hours($scope.issues);
                                $scope.last7Days = ShippableService.filterLast7Days($scope.issues);
                                $scope.moreThan7Days = ShippableService.filterMoreThan7Days($scope.issues);
                                $scope.results = true;
                            }
                        }, function (response) {
                            console.error(response);
                        });
                    }
                };
            }]);