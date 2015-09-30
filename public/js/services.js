'use strict';

angular.module('shippableApp.services', [])
        .factory('ShippableService', ['$http', 'clientId', 'clientSecret', function ($http, clientId, clientSecret) {
                return {
                    authorize : function () {
                        return $http({
                            url: 'https://api.github.com/authorizations/clients/'+clientId,
                            method: 'PUT', 
                            data: {
                              "client_secret": clientSecret,
                              "scopes": [
                                "public_repo"
                              ],
                              "note": "Shippabe App"
                            }
                        });
                    },
                    getIssueCount : function(owner, repo, page) {
                        return $http({
                            method: 'GET',
                            url: 'https://api.github.com/search/issues?q=state:open+repo:'+repo+'+user:'+owner+'&per_page=30&page='+page
                            // url: 'https://api.github.com/repos/' + owner + '/' + repo + '/issues'
                        });
                    }, 
                    fetchIssues: function (owner, repo, page) {
                        return $http({
                            method: 'GET',
                            // url: 'https://api.github.com/search/issues?q=state:open+repo:'+repo+'+user:'+owner+'&per_page=100&page='+page
                            url: 'https://api.github.com/repos/' + owner + '/' + repo + '/issues&per_page=30&page='+page
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