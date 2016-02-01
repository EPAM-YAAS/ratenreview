(function () {
  'use strict';

  angular.module('epam.review')
  .directive('review', function () {
    return {
      restrict: 'E',
      templateUrl: 'src/templates/review.html',
      replace:true,
      scope: {
        review: '='
      }
    };
  });
})();
