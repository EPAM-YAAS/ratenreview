(function () {
  'use strict';

  angular.module('epam.review')
  .directive('ratings', function () {
    return {
      restrict: 'E',
      templateUrl: 'js/app/review/templates/ratings.html',
      replace:true,
      scope: {
        reviewScore: '@?',
        max: '@?',
        readonly: '@?',
        onScoreSelect: '&?'
      },
      controller:['$scope',function($scope){
        if(!$scope.reviewScore) {$scope.reviewScore=0;}
        if(!$scope.max){$scope.max=5;}
        if(!$scope.onScoreSelect) {$scope.onScoreSelect=function(){};}

        function updateStars() {
          $scope.stars = [];
          for (var i = 0; i < $scope.max; i++) {
            $scope.stars.push({
              filled: i < $scope.reviewScore
            });
          }
        }

        $scope.$watch('reviewScore', function() {
          updateStars();
        });

        $scope.toggle = function(index) {
          if ($scope.readonly !== undefined || $scope.readonly === 'false'){
            $scope.reviewScore=index+1;
            $scope.onScoreSelect({
              score: index + 1
            });
          }
        };

      }]
    };
  });
})();
