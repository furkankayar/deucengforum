'use strict'

const utility = require('../../utility');
let commentModel;
let sequelize;
let userCommentModel;
let redisClient;

module.exports = (injectedCommentModel, injectedSequelize, injectedUserCommentModel, injectedRedisClient) => {

  commentModel = injectedCommentModel;
  sequelize = injectedSequelize;
  userCommentModel = injectedUserCommentModel;
  redisClient = injectedRedisClient;

  return {
    createAnonymousComment: createAnonymousComment,
    createAuthenticatedComment: createAuthenticatedComment,
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

function createAuthenticatedComment(req, res){

  let comment = req.body.comment;
  let postId = req.body.postId;
  let token = req.headers.authorization;

  if(!utility.isString(comment) || !utility.isString(postId) || !utility.isString(token) || comment.length <= 0 || comment.length > 350){
    utility.sendResponse(400, res, "missing or unexpected data", true);
  }

  redisClient.get(token.substr(7), async (err, rawResponse) => {

    if(err || rawResponse === null){
      return utility.sendResponse(500, res, "session error", true);
    }

    let userId = JSON.parse(rawResponse).user_id;
    const t = await sequelize.transaction();

    try{
      let createdComment = await commentModel.create({
        post_id: postId,
        body: comment
      }, { transaction: t });

      await userCommentModel.create({
        user_id: userId,
        comment_id: createdComment.dataValues.comment_id
      }, { transaction: t });

      await t.commit();
      utility.sendResponse(200, res, "success", false);
    }
    catch(err){
      await t.rollback();
      utility.sendResponse(500, res, "error", true);
    }
  });
}
