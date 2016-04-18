(function () {
    'use strict';

    angular.module('epam.review')
        .directive('reviewList', function () {
            return {
                restrict: 'E',
                templateUrl: 'js/app/review/templates/review-list.html',
                scope: {
                    productId: '='
                },
                controller: ['$scope', '$rootScope', 'ReviewSvc', function ($scope, $rootScope, ReviewSvc) {
                    function getReviews(lastReviewId, pageSize, callback) {
                        $rootScope.spinnerShown = true;
                        ReviewSvc.getReviewsByParams(
                            {
                                'productId': $scope.productId,
                                'reviewsStatus': 'approved',
                                'startFromExcluded': lastReviewId,
                                'pageSize': pageSize
                            },
                            callback
                        );
                    }
                    
                    var getReviewQuantityFor = function(productId) {
                        ReviewSvc.getReviewQuantityFor(productId, function(data) {
                            if (data.value > 3) {
                                $scope.canShowMore = true;
                            }
                        });
                    };
                    
                    $scope.canShowMore = false;
                    $scope.reviews = [];
                    
                    getReviews(null, 3, function(reviews) {
                        $scope.reviews = $scope.reviews.concat(reviews);
                        $rootScope.spinnerShown = false;
                    });
                    
                    getReviewQuantityFor($scope.productId);
                    
                    $scope.onShowMore = function () {
                        var lastReviewId = $scope.reviews[$scope.reviews.length - 1].id;

                        getReviews(lastReviewId, 5, function (reviews) {
                            $scope.reviews = $scope.reviews.concat(reviews);
                            if (reviews.length < 5) {
                                $scope.canShowMore = false;
                            }
                            $rootScope.spinnerShown = false;
                        });
                    };
                    
                    $scope.$on('review:review-edited', function(){
                        $scope.reviews = [];
                        getReviews(null, 3, function(reviews) {
                            $scope.reviews = $scope.reviews.concat(reviews);
                        });
                    });
                    
                    $rootScope.$on('review:review-posted', function() {
                        if (!$rootScope.configuration.approvalFlowEnable) {
                            getReviews(null, 3, function(reviews) {
                                $scope.reviews = reviews;
                                getReviewQuantityFor($scope.productId);
                                $rootScope.spinnerShown = false;
                            });
                        }
                    });

                }]
            };
        });
})();
