(function () {
    'use strict';

    angular.module('epam.review')
        .directive('partialStarRatings', function () {
            return {
                restrict: 'EA',
                templateUrl: 'js/app/review/templates/partial-star-ratings.html',
                scope: {
                    reviewScore: '@?',
                    max: '@?'
                },
                controller: function ($scope) {
                    if ($scope.max === undefined) {
                        $scope.max = 5;
                    }
                    function updateStars() {
                        $scope.stars = [];
                        for (var i = 0; i < $scope.max; i++) {
                            $scope.stars.push({});
                        }
                        var starContainerMaxWidth = 100; //%
                        $scope.filledInStarsContainerWidth = $scope.reviewScore / $scope.max * starContainerMaxWidth;
                    }

                    $scope.$watch('reviewScore', function () {
                        updateStars();
                    });
                }
            };
        });

})();
