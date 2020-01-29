'use strict'

const utility = require('../../utility');
let postModel;
let postMenuView;
let redisClient;
let sequelize;

module.exports = (injectedPostModel, injectedPostMenuView, injectedRedisClient, injectedSequelize) => {

  postModel = injectedPostModel;
  postMenuView = injectedPostMenuView;
  redisClient = injectedRedisClient;
  sequelize = injectedSequelize;

  return {
    createNewPost: createNewPost,
    getPosts: getPosts,
    getPost: getPost,
    getCommentsOfPost: getCommentsOfPost,
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

    if(err){
      return utility.sendResponse(500, res, "redis error", true);
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
        console.log(err);
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
        console.log(err);
        return utility.sendResponse(500, res, "database error", true);
      }
      return utility.sendResponse(500, res, "error", true);
    });
}
