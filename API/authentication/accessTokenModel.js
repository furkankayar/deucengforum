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

  redisClient.setex(accessToken, expires, user.username); // user.username must be user.user_id
  callback(null);
  /*sessionDBHelper.saveAccessToken(accessToken, user.username, expires)
    .then(() => callback(null))
    .catch(error => callback(error));*/
}

function getAccessToken(bearerToken, callback){

  redisClient.get(bearerToken, (err, res) => {
    if(err){
      callback(true, null);
    }
    else{
      if(res === null){
        callback(false, bearerToken);
      }
      else{
        return createAccessTokenForm(res);
      }
    }
  });
  /*sessionDBHelper.getSessionFromBearerToken(bearerToken)
    .then(session => {
      if(session === null){
        callback(false, bearerToken);
      }
      else{
        return createAccessTokenFrom(session);
      }
    })
    .then(accessToken => callback(false, accessToken))
    .catch(error => callback(true, null));*/
}

function createAccessTokenFrom(session){

  return Promise.resolve({
    user:{
      id: session.username,
    },
    expires: session.expires
  });
}
