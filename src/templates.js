angular.module('epam.review').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/templates/ratings.html',
    "<div class=\"star-rating\">\r" +
    "\n" +
    "  <span ng-repeat=\"star in stars\" class=\"star\"\r" +
    "\n" +
    "        ng-class=\"{'star-filled': star.filled, 'star-cursor-pointer':readonly==='false'}\"\r" +
    "\n" +
    "        ng-click=\"toggle($index)\">\r" +
    "\n" +
    "    <i class=\"glyphicon glyphicon-star\"></i>\r" +
    "\n" +
    "  </span>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/templates/review-form.html',
    "<div class=\"review-form\">\r" +
    "\n" +
    "    <div class=\"review-form-header\">\r" +
    "\n" +
    "        <h3>Product review </h3>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"review-form-body\">\r" +
    "\n" +
    "        <div class=\"description\" ng-if=\"showThanksForReview\">\r" +
    "\n" +
    "            <p class=\"messages-block\">Thanks! Your comment was added and will be published after review</p>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"description\" ng-if=\"showAlreadyAddedReview\">\r" +
    "\n" +
    "           <p class=\"messages-block\">You have already added a review</p>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "                \r" +
    "\n" +
    "        <form name=\"ReviewForm\">\r" +
    "\n" +
    "            <div ng-if=\"showAllInputs\">\r" +
    "\n" +
    "	            <div class=\"review-form-ratings\">\r" +
    "\n" +
    "	                <ratings readonly=\"false\" on-score-select=\"rateReview(score)\"></ratings>\r" +
    "\n" +
    "	            </div>\r" +
    "\n" +
    "	            <div class=\"form-group\" ng-if=\"showAuthorName\" show-errors>\r" +
    "\n" +
    "	                <label for=\"authorName\"> Author name* </label>\r" +
    "\n" +
    "	                <input type=\"text\" class=\"form-control\" id=\"authorName\" name=\"authorName\" ng-model=\"review.authorName\"\r" +
    "\n" +
    "	                       required/>\r" +
    "\n" +
    "	\r" +
    "\n" +
    "	                <p class=\"error-msg\" ng-if=\"ReviewForm.authorName.$error.required\">The author's name is required</p>\r" +
    "\n" +
    "	            </div>\r" +
    "\n" +
    "	            <div class=\"form-group\" ng-if=\"showAuthorEmail\" show-errors>\r" +
    "\n" +
    "	                <label for=\"authorEmail\"> Author email* </label>\r" +
    "\n" +
    "	                <input type=\"email\" class=\"form-control\" id=\"authorEmail\" name=\"authorEmail\"\r" +
    "\n" +
    "	                       ng-model=\"review.authorEmail\" required/>\r" +
    "\n" +
    "	\r" +
    "\n" +
    "	                <p class=\"error-msg\" ng-if=\"ReviewForm.authorEmail.$error.required\">The authors's email is required</p>\r" +
    "\n" +
    "	\r" +
    "\n" +
    "	                <p class=\"error-msg\" ng-if=\"ReviewForm.authorEmail.$error.email\">The email address is invalid</p>\r" +
    "\n" +
    "	            </div>\r" +
    "\n" +
    "	            <div class=\"form-group\">\r" +
    "\n" +
    "	                <label for=\"reviewText\"> Review text </label>\r" +
    "\n" +
    "	                <textarea class=\"form-control\" type=\"textarea\" id=\"reviewText\" name=\"reviewText\"\r" +
    "\n" +
    "	                          maxlength=\"140\" rows=\"6\"\r" +
    "\n" +
    "	                          ng-model=\"review.reviewText\" ></textarea>\r" +
    "\n" +
    "	            </div>\r" +
    "\n" +
    "	\r" +
    "\n" +
    "	            <button type=\"button\" ng-click=\"submit()\" id=\"submit\" name=\"submit\" class=\"btn btn-primary pull-right\">\r" +
    "\n" +
    "	                Send review\r" +
    "\n" +
    "	            </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "                      \r" +
    "\n" +
    "            <div class=\"login-button-holder\">\r" +
    "\n" +
    "				<button type=\"button\" ng-if=\"showLogInToSendReviewButton\" class=\"btn btn-primary\" onclick=\"javascript:document.getElementById('login-btn').click();\">\r" +
    "\n" +
    "					Sign in to write a review...\r" +
    "\n" +
    "				</button>\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/templates/review-list.html',
    "<div>\r" +
    "\n" +
    "  <review ng-repeat=\"review in reviews\" review=\"review\"></review>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <h3 ng-if=\"reviews.length==0\" style=\"text-align: center\">No reviews</h3>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <show-more on-show-more=\"onShowMore()\" ng-if=\"canShowMore\"></show-more>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/templates/review.html',
    "<div class=\"row review\">\r" +
    "\n" +
    "  <div class=\"col-md-12\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "      <div class=\"col-md-8\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <span ng-bind-html=\"review.authorName\" class=\"review-user-name\"></span>\r" +
    "\n" +
    "        <span ng-bind-html=\"review.createdAt  | date:'dd MMMM yyyy'\" class=\"review-date\"></span>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "      <div class=\"col-md-4\">\r" +
    "\n" +
    "        <ratings review-score=\"{{review.rating}}\" class=\"pull-right-md\" ng-if=\"review.rating > 0\"></ratings>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div class=\"col-md-12 review-content\">\r" +
    "\n" +
    "    <span ng-bind-html=\"review.reviewText\"></span>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/templates/show-more.html',
    "<div class=\"show-more-wrapper\">\r" +
    "\n" +
    "  <a class=\"btn btn-link show-more-text\" ng-click=\"onMoreClick()\"\r" +
    "\n" +
    "  ng-mouseenter=\"hover = true\" ng-mouseleave=\"hover = false\">\r" +
    "\n" +
    "  <span class=\"btn btn-circle btn-xl\" ng-class=\"{'cirle-hover':hover, 'cirle-raw':!hover}\">\r" +
    "\n" +
    "    <i class=\"glyphicon glyphicon-repeat\" ng-class=\"{'circle-spin':spinning}\"/>\r" +
    "\n" +
    "  </span>\r" +
    "\n" +
    "  <span ng-bind-html=\"'SHOW MORE'\"  />\r" +
    "\n" +
    "</a>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
