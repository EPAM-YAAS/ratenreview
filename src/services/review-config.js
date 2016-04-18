(function () {
    'use strict';

    angular.module('epam.review')
        .factory('ReviewConfigSvc', [
            function () {
//                for local storefront
//                1. uncomment this:
                return {
                    baseUrl: 'http://localhost:9379'
                };
//                2. comment this:
//                return {
//                    baseUrl: 'https://api.yaas.io/epam/rate-review/v2'
//                };
            }]);

})();