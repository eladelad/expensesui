angular.module('transactions', []).
    factory("$transactions",function ($http) {
                return {
                    getTrans: function (cb) {
                        $http({method: 'GET', url: 'http://localhost:3002/gettrans'}).
                            success(function (data, status, headers, config) {
                                        cb(data);
                                    })
                    }
                }
    }).directive("transList", function () {
        return {
            restrict: "E",
            scope: {},
            templateUrl: "/modules/trans/trans.htm",
            controller: function ($scope, $transactions) {
                console.log("Directive transList");
                $transactions.getTrans(function(trans){
                    console.log(trans);
                    $scope.trans = trans.trans;
                })
            }
        }

    });