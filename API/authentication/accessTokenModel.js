'use strict'
//CHECK: https://blog.cloudboost.io/how-to-make-an-oauth-2-server-with-node-js-a6db02dc2ce7

let userDBHelper;
let redisClient;

module.exports = (injectedUserModelDBHelper, injectedRedisClient) => {

  userDBHelper = injectedUserModelDBHelper;
  redisClient = injectedRedisClient;

  return {

    getClient: getClient,
    grantTypeAllowed: grantTypeAllowed,
    getUser: getAccount,
    saveAccessToken: saveAccessToken,
    getAccessToken: getAccessToken

  }
}

function getClient(clientID, clientSecret, callback){

  const client = {
    clientID,
    clientSecret,
    grants: null,
    redirectUris: null
  }

  callback(false, client);
}

function grantTypeAllowed(clientID, grantType, callback){

  callback(false, true);
}

function getAccount(username, password, callback){

  userDBHelper.getUserFromCredentials(username, password)
    .then(user => callback(false, user))
    .catch(error => callback(error, null));
}

function saveAccessToken(accessToken, clientID, expires, user, callback){

  let token = {
    username: user.username,
    expires: expires
  }
  redisClient.setex(accessToken, 3600, JSON.stringify(token));
  callback(null);
}

function getAccessToken(bearerToken, callback){

  redisClient.get(bearerToken, (err, session) => {
    if(err){
      callback(true, null);
    }
    else{

      if(session === null){
        callback(false, bearerToken);
      }
      else{
        createAccessTokenFrom(session)
          .then(accessToken => {
            callback(false, accessToken);
          });
      }
    }
  });
}

function createAccessTokenFrom(session){

  let jsonSession = JSON.parse(session);

  return Promise.resolve({
    user:{
      id: jsonSession.username,
    },
    expires: jsonSession.expires
  });
}
