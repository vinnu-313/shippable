'use strict';

angular.module('shippableApp.services', [])
        .factory('ShippableService', ['$http', function ($http) {
                return {
                    fetchIssues: function (owner, repo) {
                        return $http({
                            method: 'GET',
//                           https://github.com/Shippable/support
                            url: 'https://api.github.com/repos/' + owner + '/' + repo + '/issues'
                        });
                    },
                    filter24Hours: function (issues) {
                        return issues.filter(function (issue) {
                            var d = new Date();
                            var id = new Date(issue.created_at);
                            // Setting to last 24hours
                            d.setHours(d.getHours() - 24);
                            return id > d;
                        });
                    },
                    filterLast7Days: function (issues) {
                        return issues.filter(function (issue) {
                            var to = new Date();
                            var frm = new Date();
                            var id = new Date(issue.created_at);
                            // Setting to last 7 days
                            to.setDate(to.getDate() - 7);
                            frm.setHours(frm.getHours() - 24);
                            return (id > to && id < frm); 
                        });
                    },
                    filterMoreThan7Days: function (issues) {
                        return issues.filter(function (issue) {
                            var to = new Date();
                            var id = new Date(issue.created_at);
                            // Setting to last 7 days
                            to.setDate(to.getDate() - 7);
                            return id < to;
                        });
                    }
                };
            }]);