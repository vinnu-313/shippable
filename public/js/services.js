'use strict';

angular.module('shippableApp.services', [])
    .factory('ShippableService', ['$http', 'user', 'clientId', 'clientSecret', 'token', function ($http, user, clientId, clientSecret, token) {
            return {
                authorize : function () {
                    // var authdata = Base64.encode(user + ':' + token);
                    $http.defaults.headers.common['Authorization'] = 'Basic dmlubnUtMzEzOnNtcnV0aTc='; 
                    // return;
                    // return $http({
                    //     url: 'https://api.github.com/authorizations/clients/'+clientId,
                    //     method: 'POST',
                    //     data : {
                    //       "client_secret": clientSecret,
                    //       "note": "Issues App"
                    //     }
                    // });
                },
                getIssueCount : function(owner, repo, page) {
                    return $http({
                        method: 'GET',
                        url: 'https://api.github.com/repos/' + owner + '/' + repo
                    });
                }, 
                fetchIssues: function (owner, repo, page) {
                    return $http({
                        method: 'GET',
                        // url: 'https://api.github.com/search/issues?q=state:open+repo:'+repo+'+user:'+owner+'&per_page=100&page='+page
                        url: 'https://api.github.com/repos/' + owner + '/' + repo + '/issues',
                        params : {
                            page : page,
                            per_page : 30,
                            client_id : clientId,
                            client_secret: clientSecret
                        }
                    });
                },
                filterIssues: function (issues) {
                    return issues.filter(function(issue){
                        return !('pull_request' in issue);
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