(function () {
    'use strict';

    angular.module('epam.review')
        .factory('CommentsSvc', ['Restangular', 'ReviewConfigSvc',
            function (Restangular, reviewConfig) {
                return {
                    Comments: Restangular.withConfig(function (RestangularConfigurer) {
                        RestangularConfigurer.setBaseUrl(reviewConfig.baseUrl);
                    }),
                    postComment: function(comment, success) {
                        this.Comments.all('comments').post(comment).then(success);
                    },
                    getComments: function(params, success) {
                        this.Comments.all('comments').getList(params).then(function (response) {
                            success(Restangular.stripRestangular(response));
                        });
                    }
                };
            }]);

})();
