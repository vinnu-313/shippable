'use strict';

angular.module('shippableApp.controllers', ['shippableApp.services'])
        .controller('AppCtrl', ['$q', '$scope', 'ShippableService', function ($q, $scope, ShippableService) {
                $scope.appName = "Shippable screening test ";
                //Authorizing on load
                ShippableService.authorize();//.then(function(response){
                
                $scope.results = true;

                // Gets called on click of show issues on the UI.
                $scope.showIssues = function () {
                    $scope.results = false;
                    if ($scope.repoName.indexOf('github.com') === -1) {
                        alert("Not a github repo");
                    } else if ($scope.repoName.split('/').length !== 5) {
                        alert("Invalid github repo");
                    } else {
                        var ar = $scope.repoName.split('/');
                        ShippableService.getIssueCount(ar[3], ar[4], 1).then(function (response) {
                            var iterations = Math.ceil(response.data.open_issues_count / 30);
                            $scope.issues = [];
                            var promises = [];
                            for(var i = 0; i < iterations; ++i){
                                promises.push(ShippableService.fetchIssues(ar[3], ar[4], i+1));
                            }
                            $q.all(promises).then(function(data){
                                for(i = 0; i< iterations; ++i){
                                    console.log(data[i].data);
                                    $scope.issues = $scope.issues.concat(data[i].data);
                                }
                                console.info('Including Pull requests : '+$scope.issues.length);
                                $scope.issues = ShippableService.filterIssues($scope.issues);
                                console.info('Excluding Pull requests : '+$scope.issues.length);
                                $scope.last24Hours = ShippableService.filter24Hours($scope.issues);
                                $scope.last7Days = ShippableService.filterLast7Days($scope.issues);
                                $scope.moreThan7Days = ShippableService.filterMoreThan7Days($scope.issues);
                                $scope.results = true;
                            }, function(error){
                                console.error(error);
                            });    
                        }, function (response) {
                            console.error(response);
                        });
                    }
                };
            }]);