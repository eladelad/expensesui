angular.module('categories',['cdatepkr']).
    factory('$categories', function($http) {
                return {
                    getCategories: function(cb) {
                        $http({method: 'GET', url: '/getcats'}).
                            success(function(data, status, headers, config){
                                cb(data);
                            })
                    },
                    getSubCategories: function(cb){
                        $http({method:'GET', url: '/getsubcats'}).
                            success(function(data, status, headers, config){
                                cb(data);
                            })
                    },
                    getPaymentType: function(cb){
                        $http({method:'GET', url: '/getpayments'}).
                            success(function(data, status, headers, config){
                                cb(data);
                            })
                    },
                    getAccounts: function(cb){
                        $http({method:'GET', url: '/getaccounts'}).
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
                                  url: '/addtrans',
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
                                 templateUrl:'/modules/categories/newcategories.htm',
                                 controller: function($scope, $categories, $transactions){

                                     $scope.categoryNotSelected = true;
                                     $scope.subCategoryNotSelected = false;
                                     $categories.getCategories(function(categories){
                                         console.log("function getCategories");
                                         $scope.categories = categories.cats;
                                     });
                                     $categories.getSubCategories(function(subcategories){
                                         console.log("function getSubCategories");
                                         $scope.subcategories = subcategories.subcats;
                                     });
                                     $categories.getPaymentType(function(paymenttypes){
                                         console.log("function getPaymentType");
                                         $scope.paymenttypes = paymenttypes.paymenttype;
                                     });
                                     $categories.getAccounts(function(accounts){
                                         console.log("function getAccounts");
                                         $scope.accounts = accounts.accounts;
                                     });
                                     $scope.setCurrentCategory = function (category) {
                                         console.log("funciton setCurrentCategory(" + category.name + ")");
                                         $scope.currentCategory = category;
                                        $scope.categoryFilter = {category: category.id};
                                         $scope.categoryNotSelected = false;
                                         $scope.subCategoryNotSelected = true;
                                         //console.log($transactions.trans);
                                     };
                                     $scope.setCurrentSubCategory = function (subcategory){
                                         console.log("function setCurrentSubCategory(" + subcategory.name +")");
                                         $scope.currentSubCategory = subcategory;
                                         $scope.subCategoryNotSelected = false;

                                     };
                                     $scope.addTrans = function () {
                                         console.log("adding transaction");
                                         $categories.addNewTransaction(
                                             $scope.currentCategory.id,
                                             $scope.currentSubCategory.id,
                                             $scope.currentAmount,
                                             $scope.currentAccount.id,
                                             $scope.currentPaymentType.id,
                                             $scope.currentDate,
                                             $scope.currentComment,
                                             function(inserted){
                                                 if (inserted){
                                                    $scope.currentAmount = "";
                                                    $scope.currentDate = "";
                                                    $scope.currentComment="";
                                                 } else { console.log(inserted); console.log("Error inserting"+inserted)}
                                             })
                                     }

                                 },
                                link: function ($scope) {
                                    console.log("link");

                                }
                             }
                         }

)