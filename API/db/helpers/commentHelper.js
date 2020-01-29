'use strict'

const utility = require('../../utility');
let commentModel;

module.exports = (injectedCommentModel) => {

  commentModel = injectedCommentModel;

  return {
    createAnonymousComment: createAnonymousComment,
  }
}



function createAnonymousComment(req, res){

  let comment = req.body.comment;
  let postId = req.body.postId;

  if(!utility.isString(postId) || !utility.isString(comment) || comment.length <= 0 || comment.length > 350) {
    utility.sendResponse(400, res, "missing or unexpected data", true);
  }

  commentModel.create({
    post_id: postId,
    body: comment
  })
    .then(ans => {
      if (ans) {
        return utility.sendResponse(200, res, "success", false);
      }
      return utility.sendResponse(500, res, "error", true);
    })
    .catch(err => {
      return utility.sendResponse(500, res, "database error", true);
    });
}
