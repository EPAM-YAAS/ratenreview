(function () {
    'use strict';

    angular.module('epam.review')
        .factory('ReviewConfigSvc', [
            function () {
                return {
                    baseUrl: 'https://api.yaas.io/epam/rate-review/v1'
                };
            }]);

})();
