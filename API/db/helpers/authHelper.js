'use strict'

const utility = require('../../utility');
let userModel;
let bcrypt;

module.exports = (injectedUserModel, injectedBcrypt) => {

  userModel = injectedUserModel;
  bcrypt = injectedBcrypt;

  return {
    login: login,
    checkAuthentication: checkAuthentication,
  };
}

function login(username, password, callback){

  userModel.findOne({
    where: {
      username: username
    }
  })
    .then(user => {
      if(bcrypt.compareSync(username + password, user.password)){
        callback(user.is_active);
      }
      else{
        callback(true);
      }
    })
    .catch(err => {
      callback(true);
    });
}

function checkAuthentication(req, res){

  return utility.sendResponse(200 ,res, "success", false);
}
