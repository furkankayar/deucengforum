'use strict'

const utility = require('../../utility');
let postModel;
let redisClient;

module.exports = (injectedPostModel, injectedRedisClient) => {

  postModel = injectedPostModel;
  redisClient = injectedRedisClient;

  return {
    createNewPost: createNewPost,
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
          return utility.sendResponse(200, res, "post created", false);
        }
      })
      .catch(err => {
        if(err){
          return utility.sendResponse(500, res, "database error", true);
        }
      });
  });
}
