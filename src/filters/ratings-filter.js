(function () {
  'use strict';
  angular.module('epam.review')
  .filter('ratings', function(){
    return function(val, range, filled) {
      range = parseInt(range);
      filled = parseInt(filled);
      for (var i=1; i<=filled; i++){
        val.push(i);
      }
      for(var j=filled+1;j<=range;j++){
        val.push(0);
      }
      return val;
    };
  });
})();
