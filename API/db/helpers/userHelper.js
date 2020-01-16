'use strict'

const utility = require('../../utility');
let userModel;
let bcrypt;

module.exports = (injectedUserModel, injectedBcrypt) => {

  userModel = injectedUserModel;
  bcrypt = injectedBcrypt;

  return {
    getUserFromCredentials: getUserFromCredentials,
    registerUser: registerUser,
    checkEmailUniqueness: checkEmailUniqueness,
    checkUsernameUniqueness: checkUsernameUniqueness,
  };
};


async function getUserFromCredentials(username, password){

  let user = await userModel.findOne({
    where: {
      username: username
    }
  });

  if(user != null && bcrypt.compareSync(username + password, user.password)){
    return user;
  }

  return null;
}

async function checkUsernameUniqueness(req, res){

  let username = req.body.username;
  let user;

  if(!utility.isString(username) || username === ''){
    return utility.sendResponse(400, res, "missing username", true);
  }

  try{
    user = await userModel.findOne({
      where: {
        username: username
      }
    });
  }
  catch(err){
    return utility.sendResponse(500, res, "database error", true);
  }

  if(user){
    return utility.sendResponse(200, res, "username exists", true);
  }

  return utility.sendResponse(200, res, "username does not exist", false);
}

async function checkEmailUniqueness(req, res){

  let email = req.body.email;
  let user;


  if(!utility.isString(email) || email === ''){
    return utility.sendResponse(400, res, "missing email", true);
  }

  try{
    user = await userModel.findOne({
      where: {
        email: email
      }
    });
  }
  catch(err){
    return utility.sendResponse(500, res, "database error", true);
  }

  if (user) {
    return utility.sendResponse(200, res, "email exists", true);
  }

  return utility.sendResponse(200, res, "email does not exist", false);
}

async function registerUser(req, res){

  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  if(!utility.isString(username) || !utility.isString(password) || !utility.isString(email)){
    return utility.sendResponse(400, res, "missing credentials", true);
  }

  try{
    let hash = bcrypt.hashSync(username + password, bcrypt.rounds);
    await userModel.create({
      username: username,
      password: hash,
      email: email
    });
  }
  catch(err){
    return utility.sendResponse(500, res, "database error", true);
  }

  return utility.sendResponse(201, res, "registration successful", false);

}
