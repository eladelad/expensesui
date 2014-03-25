angular.module('transactions', []).
    factory("$transactions",function ($http) {
        return {
            trans: [],
            getTrans: function (cb) {
                var that = this;
                $http({method: 'GET', url: '/gettrans'}).
                    success(function (data, status, headers, config) {
                        cb();
                        that.trans = data.trans;
                    })
            },
            delTrans: function(transaction,cb){
                $http({method:'POST', url: '/deletetrans', params: { transid: transaction.id}}).
                    success(function(data, status, headers, config){
                        cb(data);
                    })
            }
        }
    }).directive("transList",function () {
        return {
            restrict: "E",
            scope: {},
            templateUrl: "/modules/trans/newtrans.htm",
            controller: function ($scope, $categories, $transactions) {
                console.log("Directive transList");
                $scope.delTrans = function(transaction){
                   $transactions.delTrans(transaction, function(deleted){
                       if (deleted == 0) {
                           console.log("Deleted");
                           var index = $scope.trans.indexOf(transaction);
                           if (index != -1) { $scope.trans.splice(index, 1); }
                       } else {console.log ("Error" + deleted)}
                   });
                };
                $scope.editTrans = function(transaction){
                    console.log("Edit Transaction "+transaction.id)
                    $categories.editTrans(transaction);

                }

                $transactions.getTrans(function() {});

                $scope.$watch(function () {
                    return $transactions.trans
                }, function () {
                    $scope.trans = $transactions.trans
                });
            }

        }

    }).filter('sumIt', function () {
        return function (data, key) {
            if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
                return 0;
            }
            var sum = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                if ((data[i].Category === key) || (key === 'all')) {
                    sum += parseInt(data[i]['Amount']);
                }
            }
            return sum;
        }
    })
;