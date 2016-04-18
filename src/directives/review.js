(function () {
  'use strict';
  
  angular.module('epam.review')
  .directive('review', function () {
    return {
      restrict: 'E',
      templateUrl: 'js/app/review/templates/review.html',
      replace:true,
      scope: {
        review: '='
      },
      controller:['$scope', '$rootScope', '$element', 'VoteSvc', 'ReviewSvc', 'Notification', '$location', 'AuthSvc', 'GlobalData', 'Restangular', 'ReviewConfigSvc', 'CommentsSvc',
                  function ($scope, $rootScope, $element, VoteSvc, ReviewSvc, Notification, $location, AuthSvc, GlobalData, Restangular, ReviewConfigSvc, CommentsSvc) {
          
          var domReviewId = '#' + $scope.review.id + ' ';
          
          var hasCommentsOfStatus = function(comments, status) {
              return retrieveCommentsByStatus(comments, status).length > 0;
          };
          
          var retrieveCommentsByStatus = function (comments, status) {
              var result = [];
              
              for (var i = 0; i < comments.length; i++) {
                  if (comments[i].status && comments[i].status.toLowerCase() === status) {
                      result.push(comments[i]);
                  }
              }
              
              return result;
          };
          
          var setEdited = function() {
              if (GlobalData.customerAccount) {
                  Restangular.all('reviews').getList({authorEmail: GlobalData.customerAccount.contactEmail, productId: $scope.productId, reviewsStatus:'unapproved'}).then(function (response) {
                      $scope.edited = Restangular.stripRestangular(response).length > 0;
                  });
              } 
          };
          
          $scope.buildReviewUrl = function(review) {
              return $location.protocol() + '://' + $location.host() + ':' + $location.port() +
              '/#!/products/' + review.productId + '/#' + review.id;
          };
          
          setEdited();
          
          CommentsSvc.getComments({reviewId: $scope.review.id},
                                  function(comments) {
              
              if (comments && comments.length > 0) {
                  if (hasCommentsOfStatus(comments, 'approved')) {
                      $scope.isEditable = false;
                      $scope.comments = retrieveCommentsByStatus(comments, 'approved');
                  } else if (hasCommentsOfStatus(comments, 'unapproved')) {
                      $scope.commented = true;
                  }
              }
          });
          
          $scope.addCommentLinkVisible = true;
          
          $scope.toggleCommentInputVisibility = function() {
              $scope.showCommentInput = !$scope.showCommentInput;
              $scope.addCommentLinkVisible = false;
              $scope.isEditable = false;
          };
          
          $scope.editedReview = {
              reviewText : angular.copy($scope.review.reviewText),
              rating : angular.copy($scope.review.rating)
          };
          
          $scope.authenticated = GlobalData.user.isAuthenticated;
          
          var isUserPermittedReviewAction = function() {
              return GlobalData.customerAccount ?
                      $scope.review.authorEmail === GlobalData.customerAccount.contactEmail :
                          false;
          };
          
          var initSocialButtons = function() {
              var voteId = generateVoteId();
              
              VoteSvc.find(voteId, function(vote) {
                  if (vote.id) {
                      $scope.voteValue = +vote.value;
                      
                      var targetButtonId = voteMapping[$scope.voteValue.toString()];
                      
                      if (targetButtonId) {
                          $(domReviewId + '#' + targetButtonId).addClass('pressed');
                      }
                  }
              });
          };
          
          var initEditButton = function(review) {
              $scope.isEditable = isUserPermittedReviewAction();
              
              if (review.rank) {
                  $scope.isEditable = false;
              }
          };
          
          var areReviewsEqual = function(original, edited) {
              if (!original.rating || original.rating !== edited.rating) {
                  return false;
              }
              
              if (!original.reviewText || original.reviewText !== edited.reviewText) {
                  return false;
              }
              
              return true;
          };
          
          var generateVoteId = function() {
              if (GlobalData.customerAccount) {
                  return GlobalData.customerAccount.id + $scope.review.id;
              } else {
                  return '';
              }
          };
          
          var voteMapping = {
                  '1' : 'like',
                  '-1' : 'dislike',
                  'like' : '1',
                  'dislike' : '-1',
                  'dbllike' : '-1',
                  'dbldislike' : '1',
                  'dislikefromlike' : '-2',
                  'likefromdislike' : '2'
          };
          
          var handleBadWordsException = function(response, reviewText) {
              if (response.status && response.status === 400 &&
                      response.data) {
                  $scope.review.reviewText = reviewText;
                  var $notificationAreaDiv = $('.review-form-body .description .messages-block');
                  
                  $notificationAreaDiv.text('You can\'t post a review that contains following stop words: ');
                  
                  for(var i = 0; i < response.data.length; i++) {
                      $notificationAreaDiv.append(response.data[i]);
                      
                      if (i !== response.data.length - 1) {
                          $notificationAreaDiv.append(', ');
                      }
                  }
              }
          };
          
          initSocialButtons();
          
          $scope.isReviewEditing = false;
          
          initEditButton($scope.review);
          
          $scope.startEditing = function() {
              $scope.isReviewEditing = true;
              $(domReviewId + '.rating-buttons-container').hide();
          };
          
          $scope.rateReview = function (score) {
              if (!$scope.isReviewEditing) {
                  $scope.review.rating = score;
              }
              
              $scope.editedReview.rating = score;
          };
          
          $scope.edit = function() {
              $rootScope.spinnerShown = true;
              $scope.isReviewEditing = false;
    
              var editedReview = angular.copy($scope.review);
              
              editedReview.status = 'UNAPPROVED';
              editedReview.previousReview = $scope.review;
              editedReview.reviewText = $scope.editedReview.reviewText;
              editedReview.rating = $scope.editedReview.rating;
              
              if (!areReviewsEqual($scope.review, editedReview)) {
                  var reviewText = angular.copy($scope.review.reviewText);
                  
                  ReviewSvc.postReview(editedReview, function () {
                      $scope.$emit('review:review-edited');
                      $rootScope.spinnerShown = false;
                  }, function(response) {    
                      $scope.$emit('review:review-rejected');
                      handleBadWordsException(response, reviewText);
                      $rootScope.spinnerShown = false;
                  });
              }
          };
          
          $scope.stopEdit = function() {
              $scope.isReviewEditing = false;
              $(domReviewId + '.rating-buttons-container').show();
          };
          
          $scope.comment = function() {
              $rootScope.spinnerShown = true;
              $scope.showCommentInput = false;
              
              var comment = {
                  status : 'UNAPPROVED',
                  text : $scope.comment.text,
                  reviewId : $scope.review.id,
                  authorEmail : GlobalData.customerAccount ? GlobalData.customerAccount.contactEmail : '',
                  authorName : GlobalData.customerAccount ? GlobalData.customerAccount.firstName + ' ' +
                                                          GlobalData.customerAccount.lastName : '',
                  reviewUrl : $scope.buildReviewUrl($scope.review)
              };

              CommentsSvc.postComment(comment, function() {
                  $scope.$emit('review:review-commented');
                  $scope.addCommentLinkVisible = true;
                  $rootScope.spinnerShown = false;
              });
          };

              $scope.stopCommenting = function() {
              $scope.addCommentLinkVisible = true;
              $scope.showCommentInput = false;
              };
          
          var resolveVoteValue = function(targetId) {
              if ($scope.voteValue !== undefined) {
                  return $scope.voteValue + parseInt(voteMapping[targetId]);
              } else {
                  return parseInt(voteMapping[targetId]);
              }
          };
          
          var opposite = function(targetId) {
              if (targetId) {
                  return targetId === 'like' ? 'dislike' :
                          targetId === 'dislike' ? 'like' : null;
              }
          };
          
          $scope.performVote = function($event) {
              var targetId = $event.currentTarget.id,
                  $targetEl = $(domReviewId + '#' + targetId);
              
              var vote = {
                  reviewId : $scope.review.id,
                  authorEmail : GlobalData.customerAccount ? GlobalData.customerAccount.contactEmail : '',
                  value : resolveVoteValue(targetId),
                  id : generateVoteId()
              };
              
              if ($targetEl.hasClass('pressed')) {
                  vote.value = 0;
                  targetId = 'dbl' + targetId;
              } else if ($(domReviewId + '#' + opposite(targetId)).hasClass('pressed')) {
                  targetId += 'from' + opposite(targetId);
                  vote.value = resolveVoteValue(targetId);
              }
              
              VoteSvc.save(vote, function() {
                  if (vote.value !== 0) {
                        $targetEl.addClass('pressed');
                        $(domReviewId + '#' + opposite($targetEl.attr('id'))).removeClass('pressed');
                        $scope.isEditable = false;
                  } else {
                      $targetEl.removeClass('pressed');
                  }
                  
                  $scope.voteValue = $scope.voteValue ? $scope.voteValue + parseInt(voteMapping[targetId])
                                      : parseInt(voteMapping[targetId]);
                  
                  $scope.review.rank += parseInt(voteMapping[targetId]);
                  
                  ReviewSvc.putReview($scope.review);
                  
                  if ($scope.review.rank === 0 && isUserPermittedReviewAction()) {
                      $scope.isEditable = true;
                  }
              });
              
          };
          
          $rootScope.$on('customer:login', function() {
              $scope.authenticated = AuthSvc.isAuthenticated();
              $(domReviewId + '.rating-buttons-container').show();
              
              setEdited();
              
              if ($scope.edited) {
                  $(domReviewId + '.edit-info').show();
              }
              
              initEditButton($scope.review);
          });
          
          $rootScope.$on('user:signedout', function() {
              $scope.authenticated = AuthSvc.isAuthenticated();
              $(domReviewId + '.rating-buttons-container').hide();
              $(domReviewId + '.edit-info').hide();
              initEditButton($scope.review);
          });
          
          $scope.$on('review:review-edited', function() {
              if ($rootScope.configuration.approvalFlowEnable &&
                      !$rootScope.configuration.manyReviewsPerProduct) {
                  
                  $('.review-form-body .description .messages-block').empty().last()
                      .text('Thanks! Your review has been submitted and will be published after approval');
              }
              
              $scope.edited = true;
              
              ReviewSvc.getReviewQuantityFor($scope.review.productId, function(data) {
                  var $reviewQuantitySpan = $('.review-quantity');
                  
                  if (data.value > 0) {
                      $reviewQuantitySpan.text('(' + data.value +')');
                  } else {
                      $reviewQuantitySpan.empty();
                  }
              });
          });
          
          $scope.$on('review:review-commented', function() {
              $scope.commented = true;
          });
      }]
    };
  });
})();
