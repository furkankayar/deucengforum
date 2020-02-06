'use strict'

const utility = require('../../utility');
let postModel;
let postMenuView;
let viewModel;
let voteModel;
let redisClient;
let sequelize;


module.exports = (injectedPostModel, injectedPostMenuView, injectedViewModel, injectedVoteModel, injectedRedisClient, injectedSequelize) => {

  postModel = injectedPostModel;
  postMenuView = injectedPostMenuView;
  viewModel = injectedViewModel;
  voteModel = injectedVoteModel;
  redisClient = injectedRedisClient;
  sequelize = injectedSequelize;

  return {
    createNewPost: createNewPost,
    getPosts: getPosts,
    getPost: getPost,
    getCommentsOfPost: getCommentsOfPost,
    viewPost: viewPost,
    votePost: votePost
  }
}

function createNewPost(req, res){

  let content = req.body.content;
  let topic = req.body.topic;
  let token = req.headers.authorization;

  if(!utility.isString(topic) || !utility.isString(content) || !utility.isString(token)){
    return utility.sendResponse(400, res, "missing data", true);
  }

  redisClient.get(token.substr(7), (err, rawResponse) => {

    if(err || rawResponse === null){
      return utility.sendResponse(500, res, "session error", true);
    }

    let response = JSON.parse(rawResponse);
    let username = response.username;
    let user_id = response.user_id;

    postModel.create({
      content: content,
      topic: topic,
      user_id: user_id
    })
      .then(ans => {
        if(ans){
          return utility.sendResponse(200, res, { status: "success", post_id: ans.dataValues.post_id }, false);
        }
        return utility.sendResponse(500, res, "error", true);
      })
      .catch(err => {
        if(err){
          return utility.sendResponse(500, res, "database error", true);
        }
        return utility.sendResponse(500, "error", true);
      });
  });
}

function getPosts(req, res){

  postMenuView.findAll({
    raw:true
  })
    .then(result => {
      if(result){
        return utility.sendResponse(200, res, result, false);
      }
      return utility.sendResponse(500, res, "error", true);
    })
    .catch(err => {
      if(err){
        return utility.sendResponse(500, "database error", true);
      }
      return utility.sendResponse(500, "error", true);
    })
}

function getPost(req, res){

  let postId = req.body.postId;

  if(!utility.isString(postId)){
    utility.sendResponse(400, res, "missing post id", true);
  }

  sequelize.query('SELECT * FROM get_post(:post_id)',
    {
      plain: true,
      replacements: { post_id: postId }
    }
  )
    .then(result => {
      if(result){
        return utility.sendResponse(200, res, result, false);
      }
      return utility.sendResponse(500 ,res, "error", true);
    })
    .catch(err => {
      if(err){
        return utility.sendResponse(500, res, "database error", true);
      }
      return utility.sendResponse(500, res, "error", true);
    });
}

function getCommentsOfPost(req, res){

  let postId = req.body.postId;

  if(!utility.isString(postId)){
    utility.sendResponse(400, res, "missing post id", true);
  }

  sequelize.query('SELECT * FROM get_comments_of_post(:post_id)',
    {
      replacements: { post_id: postId }
    }
  )
    .then(result => {
      if(result){
        return utility.sendResponse(200, res, result[0], false);
      }
      return utility.sendResponse(500 ,res, "error", true);
    })
    .catch(err => {
      if(err){
        return utility.sendResponse(500, res, "database error", true);
      }
      return utility.sendResponse(500, res, "error", true);
    });
}

function viewPost(req, res){

  let postId = req.body.postId;
  let token = req.headers.authorization;

  if(!utility.isString(postId) || !utility.isString(token)){
    return utility.sendResponse(400, res, "missing data", true);
  }

  redisClient.get(token.substr(7), (err, rawResponse) => {

    if(err || rawResponse === null){
      return utility.sendResponse(500, res, "session error", true);
    }

    let response = JSON.parse(rawResponse);
    let user_id = response.user_id;

    viewModel.findOne({
      where: {
        post_id: postId,
        user_id: user_id
      }
    })
      .then(result => {
        if (result === null) {
          viewModel.create({
            post_id: postId,
            user_id: user_id
          })
            .then(ans => {
              if(ans){
                return utility.sendResponse(200, res, "success", false);
              }
              return utility.sendResponse(500, res, "error", true);
            })
            .catch(err => {
              if(err){
                return utility.sendResponse(500, res, "database error", true);
              }
              return utility.sendResponse(500, "error", true);
            });
        }
        else{
          return utility.sendResponse(200, res, "success", false);
        }
      })
     .catch(err => {
       if(err){
         return utility.sendResponse(500, res, "database error", true);
       }
       return utility.sendResponse(500, "error", true);
     });
  });
}

function votePost(req, res){

  let postId = req.body.postId;
  let token = req.headers.authorization;
  let vote = req.body.vote;

  if(!utility.isString(postId) || !utility.isString(token) || !utility.isString(vote)){
    return utility.sendResponse(400, res, "missing data", true);
  }

  if(vote != '-1' && vote != -1 && vote != 1 && vote != '1'){
    return utility.sendResponse(400, res, "invalid vote", true);
  }

  redisClient.get(token.substr(7), (err, rawResponse) => {

    if(err || rawResponse === null){
      return utility.sendResponse(500, res, "session error", true);
    }

    let response = JSON.parse(rawResponse);
    let user_id = response.user_id;

    voteModel.findOne({
      where: {
        post_id: postId,
        user_id: user_id
      }
    })
      .then(result => {
        if (result === null) {
          voteModel.create({
            post_id: postId,
            user_id: user_id,
            value: vote
          })
            .then(ans => {
              if(ans){
                return utility.sendResponse(200, res, "success", false);
              }
              return utility.sendResponse(500, res, "error", true);
            })
            .catch(err => {
              if(err){
                return utility.sendResponse(500, res, "database error", true);
              }
              return utility.sendResponse(500, "error", true);
            });
        }
        else{
          result.update({
            value: vote
          })
            .then(ans => {
              if(ans){
                return utility.sendResponse(200, res, "success", false);
              }
              return utility.sendResponse(500, res, "error", true);
            })
            .catch(err => {
              if(err){
                return utility.sendResponse(500, res, "database error", true);
              }
              return utility.sendResponse(500, "error", true);
            });
        }
      })
     .catch(err => {
       if(err){
         return utility.sendResponse(500, res, "database error", true);
       }
       return utility.sendResponse(500, "error", true);
     });
  });
}
