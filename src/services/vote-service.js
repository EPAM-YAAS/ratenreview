(function () {
    'use strict';

    angular.module('epam.review')
        .factory('VoteSvc', ['Restangular', 'ReviewConfigSvc',
            function (Restangular, reviewConfig) {
                return {
                    AppBaseUrl: Restangular.withConfig(function (RestangularConfigurer) {
                        RestangularConfigurer.setBaseUrl(reviewConfig.baseUrl);
                    }),
                    save: function(vote, success) {
                        this.AppBaseUrl.all('votes').post(vote).then(success);
                    },
                    find: function(voteId, success) {
                        this.AppBaseUrl.one('votes', voteId).get().then(function (response) {
                            success(Restangular.stripRestangular(response));
                        });
                    }
                };
            }]);

})();
