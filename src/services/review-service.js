(function () {
    'use strict';

    angular.module('epam.review')
        .factory('ReviewSvc', ['Restangular', 'ReviewConfigSvc',
            function (Restangular, reviewConfig) {
                return {
                    Review: Restangular.withConfig(function (RestangularConfigurer) {
                        RestangularConfigurer.setBaseUrl(reviewConfig.baseUrl);
                    }),
                    postReview: function (review, success) {
                        this.Review.all('reviews').post(review).then(success);
                    },
                    getReviewsByParams: function (params, success) {
                        this.Review.all('reviews').getList(params).then(function (response) {
                            success(Restangular.stripRestangular(response));
                        });
                    },
                    getReviewQuantityFor: function(productId, success) {
                        this.Review.all('reviews').all('quantity').customGET('', {
                            productId : productId
                        }).then(function (response) {
                            success(Restangular.stripRestangular(response));
                        });
                    }
                };
            }]);

})();
