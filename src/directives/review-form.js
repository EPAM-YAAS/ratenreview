(function () {
    'use strict';

    angular.module('epam.review')
        .directive('reviewForm', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'src/templates/review-form.html',
                scope: {
                    productId: '=',
                    hideInput: '=?',
                    productName: '='
                },
                controller: ['$scope', '$rootScope', 'ReviewSvc', '$location', 'AuthSvc', 'GlobalData', 'Restangular', 'ReviewConfigSvc',
                    function ($scope, $rootScope, ReviewSvc, $location, AuthSvc, GlobalData, Restangular, ReviewConfigSvc) {

                        $scope.buildProductUrl = function (productId) {
                            return $location.protocol() + '://' + $location.host() + ':' + $location.port() +
                                '/#!/products/' + productId;
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

                            ReviewSvc.postReview($scope.review, function () {
                                $scope.$emit('review:review-posted');
                            });
                            $scope.review = angular.copy(defaultReview);
                        };

                        var prePopulateAuthorAndEmail = function () {
                            $scope.review.authorName = GlobalData.customerAccount ?
                            (GlobalData.customerAccount.firstName ? GlobalData.customerAccount.firstName + ' ' : '') +
                            (GlobalData.customerAccount.lastName ? GlobalData.customerAccount.lastName : '') : '';
                            $scope.review.authorEmail = GlobalData.customerAccount ? GlobalData.customerAccount.contactEmail : '';
                        };

                        var refreshAuthorAndEmail = function () {
                            prePopulateAuthorAndEmail();
                            $scope.showAuthorName = $scope.review.authorName === '';
                            $scope.showAuthorEmail = $scope.review.authorEmail === '';
                        };

                        var refreshAll = function () {
                            refreshAuthorAndEmail();
                            Restangular.setBaseUrl(ReviewConfigSvc.baseUrl);

                            if (AuthSvc.isAuthenticated()) {
                                Restangular.all('reviews').getList({
                                    authorEmail: $scope.review.authorEmail,
                                    productId: $scope.productId
                                }).then(function (response) {
                                    $scope.showAllInputs = Restangular.stripRestangular(response).length === 0;
                                });
                                Restangular.all('reviews').getList({
                                    authorEmail: $scope.review.authorEmail,
                                    productId: $scope.productId,
                                    reviewsStatus: 'unapproved'
                                }).then(function (response) {
                                    $scope.showThanksForReview = Restangular.stripRestangular(response).length > 0;
                                });
                                Restangular.all('reviews').getList({
                                    authorEmail: $scope.review.authorEmail,
                                    productId: $scope.productId,
                                    reviewsStatus: 'approved'
                                }).then(function (response) {
                                    $scope.showAlreadyAddedReview = Restangular.stripRestangular(response).length > 0;
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
                    }]
            };
        });
})();