angular.module('transactions', []).
    factory("$transactions",function ($http) {
        return {
            currentMonth: new Date,
            trans: [],
            getTrans: function (currentMonth, currentYear, cb) {
                var that = this;
                $http({method: 'GET', url: '/gettrans', params: { mm: currentMonth, yyyy: currentYear }}).
                    success(function (data, status, headers, config) {
                        that.trans = data.trans;
                        cb();
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
            controller: function ($scope, $filter, $categories, $transactions) {
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

                $scope.currentMonth = new Date();

                $scope.$watch(function() {
                    return $scope.currentMonth
                }, function () {
                    if ($scope.currentMonth != $transactions.currentMonth){
                        $transactions.currentMonth = $scope.currentMonth;
                        $transactions.getTrans($filter('date')($scope.currentMonth,'MM'),$filter('date')($scope.currentMonth,'yyyy'),function() {});
                    }
                }, true);


                //$transactions.getTrans(function() {});

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