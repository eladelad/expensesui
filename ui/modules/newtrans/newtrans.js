angular.module('newtrans', []).
    factory('$newtrans', function ($http) {
                return{
                    addNewTransaction: function(cb){
                         $http({method: 'POST', url: 'http://localhost:3002/getcats', params: {cat: 1}}).
                            success(function(data, status, headers, config){
                                cb(data);
                        })
                    }
            }
            }).directive("newTransForm", function () {
                             return {
                                 restrict:"E",
                                 scope: { currentCategory : "@",currentSubCategory : "@"},
                                 templateUrl:'/modules/newtrans/newtrans.htm',
                                link: function () {
                                    console.log("link on new trans form");
                                }
                             }
                         })
