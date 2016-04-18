(function () {
  'use strict';

  angular.module('epam.review')
  .directive('showMore', function () {
    return {
      restrict: 'E',
      templateUrl: 'js/app/review/templates/show-more.html',
      scope: {
        onShowMore: '&'
      },
      controller: ['$scope', function ($scope) {
        $scope.spinning=false;

        $scope.onMoreClick=function(){
          $scope.spinning=true;
          if($scope.onShowMore){
            window.setTimeout(  function(){
              $scope.onShowMore();
              $scope.spinning=false;
              $scope.$apply();
            }, 1000);
          }
        };

      }]
    };
  });
})();
