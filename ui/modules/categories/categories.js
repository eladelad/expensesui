angular.module('categories',[]).
    factory('$categories', function($http) {
                return {
                    getCategories: function(cb) {
                        $http({method: 'GET', url: 'http://localhost:3002/getcats'}).
                            success(function(data, status, headers, config){
                                cb(data);
                            })
                    },
                    getSubCategories: function(cb){
                        $http({method:'GET', url: 'http://localhost:3002/getsubcats'}).
                            success(function(data, status, headers, config){
                                cb(data);
                            })
                    },
                    getPaymentType: function(cb){
                        $http({method:'GET', url: 'http://localhost:3002/getpayments'}).
                            success(function(data, status, headers, config){
                                cb(data);
                            })
                    },
                    getAccounts: function(cb){
                        $http({method:'GET', url: 'http://localhost:3002/getaccounts'}).
                            success(function(data, status, headers, config){
                                cb(data);
                            })
                    },
                    addNewTransaction: function(category, subcategory, amount, account, paymenttype, date, comment, cb){
                        var data = { category: category, subcategory: subcategory, amount: amount, account: account, paymenttype: paymenttype, date: date, comment:comment };
                        var postdata = 'mydata='+JSON.stringify(data);
                        console.log(postdata);
                         $http({
                                   method: 'POST',
                                  url: 'http://localhost:3002/addtrans',
                                   data: postdata,
                                   headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                               }).
                            success(function(data, status, headers, config){
                                cb(data);
                        })
                    }
                }
            }).directive("categoryList", function () {
                             return {
                                 restrict:"E",
                                 scope: { categoryFilter : "=", accountFilter: "=", currentSubCategory : "@" },
                                 templateUrl:'/modules/categories/categories.htm',
                                 controller: function($scope, $categories){
                                     $categories.getCategories(function(categories){
                                         console.log("Got Categories");
                                         console.log(categories);
                                         $scope.categories = categories.cats;
                                     });
                                     $categories.getSubCategories(function(subcategories){
                                         console.log("Got Sub Cats");
                                         console.log(subcategories);
                                         $scope.subcategories = subcategories.subcats;
                                     });
                                     $categories.getPaymentType(function(paymenttypes){
                                         console.log("Got payments");
                                         console.log(paymenttypes);
                                         $scope.paymenttypes = paymenttypes.paymenttype;
                                     });
                                     $categories.getAccounts(function(accounts){
                                         console.log("Got accounts");
                                         console.log(accounts);
                                         $scope.accounts = accounts.accounts;
                                     });
                                     $scope.setCurrentCategory = function (categoryId) {
                                         console.log("Clicked on Category " + categoryId);
                                         $scope.currentCategory = categoryId;
                                        $scope.categoryFilter = {category: categoryId};
                                     };
                                     $scope.setCurrentSubCategory = function (subcategoryId){
                                         console.log("Sub Category " + subcategoryId);
                                         $scope.currentSubCategory = subcategoryId;
                                     };
                                     $scope.setCurrentAccount = function (accountId) {
                                         console.log("Clicked on Account " + accountId);
                                         $scope.accountFilter = {account: accountId};
                                         $scope.currentAccount = accountId;
                                     };
                                     $scope.setCurrentPaymentType = function (paymenttypeId) {
                                         console.log("Clicked on PaymentType " + paymenttypeId);
                                         $scope.currentPaymentType = paymenttypeId;
                                     };
                                     $scope.addTrans = function () {
                                         console.log("adding transaction");
                                         $categories.addNewTransaction($scope.currentCategory,$scope.currentSubCategory,$scope.currentAmount,$scope.currentAccount,$scope.currentPaymentType,$scope.currentDate,$scope.currentComment,function(inserted){})
                                     }

                                 },
                                link: function () {
                                    console.log("link on categories list");
                                }
                             }
                         }

)