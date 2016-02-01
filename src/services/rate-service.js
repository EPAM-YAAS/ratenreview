(function () {
    'use strict';

    angular.module('epam.review')
        .factory('RateSvc', ['Restangular', 'ReviewConfigSvc',
            function (Restangular, reviewConfig) {
                return {
                    Rate: Restangular.withConfig(function (RestangularConfigurer) {
                        RestangularConfigurer.setBaseUrl(reviewConfig.baseUrl);
                    }),
                    getRatingByProductId: function (productIdParam, success) {
                        this.Rate.all('ratings').all('summary').customGET('', {
                            productId: productIdParam
                        }).then(function (response) {
                            success(Restangular.stripRestangular(response));
                        });
                    },
                    getRatingsByProductIds: function (productIdsParam, success) {
                        this.Rate.all('ratings/summary').customGET('batch', {
                            productIds: productIdsParam
                        }).then(function (response) {
                            success(Restangular.stripRestangular(response));
                        });
                    }
                };
            }]);

})();
