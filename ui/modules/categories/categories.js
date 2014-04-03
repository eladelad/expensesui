angular.module('categories',['cdatepkr']).
    factory('$categories', function($http) {
                return {
                    currentTrans: {},
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
                    addNewTransaction: function(transaction, cb){
                        var postdata = 'mydata='+JSON.stringify(transaction);
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
                    },
                    editTrans: function(transaction){
                        console.log(transaction);
                        this.currentTrans = transaction;

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

                                         var transaction = { category: $scope.currentCategory.id,
                                             subcategory: $scope.currentSubCategory.id,
                                             amount: $scope.currentAmount,
                                             account: $scope.currentAccount.id,
                                             paymenttype: $scope.currentPaymentType.id,
                                             date: $scope.currentDate,
                                             comment:$scope.currentComment };
                                         $categories.addNewTransaction(transaction,
                                             function(inserted){
                                                 if (inserted % 1 == 0){
                                                    var newtrans = {
                                                        Account: $scope.currentAccount.name,
                                                        Amount: $scope.currentAmount,
                                                        Category: $scope.currentCategory.name,
                                                        Date: $scope.currentDate,
                                                        comment: $scope.currentComment,
                                                        id: inserted,
                                                        paymentType: $scope.currentPaymentType.name,
                                                        subCategory: $scope.currentSubCategory.name
                                                    };
                                                     console.log(newtrans);
                                                    $transactions.trans.push(newtrans);
                                                    $scope.currentPaymentType = "";
                                                    $scope.currentAccount = "";
                                                    $scope.currentAmount = "";
                                                    $scope.currentDate = "";
                                                    $scope.currentComment="";
                                                 } else { console.log(inserted); console.log("Error inserting"+inserted)}
                                             })
                                     };
                                     $scope.editTrans = function(){
                                         console.log(currentTrans);
                                     };
                                 },
                                link: function ($scope) {
                                    console.log("link");

                                }
                             }
                         }

)