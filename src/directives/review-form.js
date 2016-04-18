(function () {
    'use strict';

    angular.module('epam.review')
        .directive('reviewForm', function () {
            return {
                restrict: 'E',
                replace:true,
                templateUrl: 'js/app/review/templates/review-form.html',
                scope: {
                    productId: '=',
                    hideInput: '=?',
                    productName: '='
                },
                controller: ['$scope', '$rootScope', 'ReviewSvc', 'Notification', '$location', 'AuthSvc', 'GlobalData', 'Restangular','ReviewConfigSvc',
                             function ($scope, $rootScope, ReviewSvc, Notification, $location, AuthSvc, GlobalData, Restangular, ReviewConfigSvc) {
                
                    $scope.buildProductUrl = function(productId) {
                        return $location.protocol() + '://' + $location.host() + ':' + $location.port() +
                        '/#!/products/' + productId;
                    };
                    
                    var handleBadWordsException = function(response, reviewText) {
                        if (response.status && response.status === 400 &&
                                response.data) {
                            $scope.review.reviewText = reviewText;
                            $scope.stopWords = response.data;
                            $scope.showPleaseCheckBadWords = true;
                        }
                    };
                    
                    var defaultReview = {
                        authorName: '',
                        authorEmail: '',
                        reviewText: '',
                        rating: -1,
                        productId: $scope.productId,
                        productName: $scope.productName,
                        productUrl: $scope.buildProductUrl($scope.productId)
                    };
                    $scope.review = angular.copy(defaultReview);

                    $scope.rateReview = function (score) {
                        $scope.review.rating = score;
                    };
                    
                    $scope.submit = function () {
                      $scope.$broadcast('review:show-errors-check-validity');
                      if ($scope.ReviewForm.$invalid) {
                        return;
                      }
                      
                      $scope.showPleaseCheckBadWords = false;
                      
                      var reviewText = angular.copy($scope.review.reviewText);
                      
                      ReviewSvc.postReview($scope.review, function () {
                          $scope.$emit('review:review-posted');
                      }, function(response) {    
                          $scope.$emit('review:review-rejected');
                          handleBadWordsException(response, reviewText);
                      });
                      $scope.review = angular.copy(defaultReview);
                    };
                    
                    var prePopulateAuthorAndEmail = function(){                        
                        if ($rootScope.currentUser) {
                            $scope.review.authorName = ($rootScope.currentUser.firstName ? $rootScope.currentUser.firstName + ' ' : '') +
                                ($rootScope.currentUser.lastName ? $rootScope.currentUser.lastName : '');
                            $scope.review.authorEmail = $rootScope.currentUser.contactEmail || '';
                        } else if (GlobalData.customerAccount) {
                            $scope.review.authorName = (GlobalData.customerAccount.firstName ? GlobalData.customerAccount.firstName + ' ' : '') +
                            (GlobalData.customerAccount.lastName ? GlobalData.customerAccount.lastName : '');
                        $scope.review.authorEmail = GlobalData.customerAccount.contactEmail || '';
                    }
                    };
                    
                    var refreshAuthorAndEmail = function(){
                        prePopulateAuthorAndEmail();
                        $scope.showAuthorName = !$scope.review.authorName;
                        $scope.showAuthorEmail = !$scope.review.authorEmail;
                    };
                    
                    var getConfiguration = function() {
                    	Restangular.one('configuration').get().then(function(response) {
                            $rootScope.configuration = Restangular.stripRestangular(response);
                        });
                    };

                    var refreshAll = function(){
                        refreshAuthorAndEmail();
                        Restangular.setBaseUrl(ReviewConfigSvc.baseUrl);
                        
                        getConfiguration();
                        
                        if (AuthSvc.isAuthenticated()){
                            Restangular.all('reviews').getList({authorEmail: $scope.review.authorEmail, productId: $scope.productId}).then(function (response) {
                                $scope.showAllInputs = Restangular.stripRestangular(response).length === 0 || $rootScope.configuration.manyReviewsPerProduct;
                            });
                            
                            Restangular.all('reviews').getList({authorEmail: $scope.review.authorEmail, productId: $scope.productId, reviewsStatus:'unapproved'}).then(function (response) {
                                $scope.showThanksForReview = Restangular.stripRestangular(response).length > 0;
                            }).then(function() {
                                if (!$scope.showThanksForReview) {
                                    Restangular.all('reviews').getList({authorEmail: $scope.review.authorEmail, productId: $scope.productId, reviewsStatus:'approved'}).then(function (response) {
                                        $scope.showAlreadyAddedReview = Restangular.stripRestangular(response).length > 0 && !$rootScope.configuration.manyReviewsPerProduct;
                                    });
                                }
                            });
                            
                            $scope.showLogInToSendReviewButton = false;
                        } else {
                            $scope.showLogInToSendReviewButton = true;
                            $scope.showAllInputs = false;
                            $scope.showThanksForReview = false;
                            $scope.showAlreadyAddedReview = false;
                        }
                    };
                    
                    refreshAll();
                    
                    $rootScope.$on('customer:login', refreshAll);
                    $rootScope.$on('user:signedout', refreshAll);
                    $rootScope.$on('review:review-posted', refreshAll);
                    $rootScope.$on('review:review-rejected', refreshAll);
                }]
            };
        });
})();