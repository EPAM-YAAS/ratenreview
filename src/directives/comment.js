(function () {
  'use strict';
  
  angular.module('epam.review')
  .directive('comment', function () {
    return {
      restrict: 'E',
      templateUrl: 'js/app/review/templates/comment.html',
      replace:true,
      scope: {
        comment: '='
      },
      controller:[function () {
      }]
    };
  });
})();
