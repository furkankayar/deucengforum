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

async function registerUser(req, res){

  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  if(!utility.isString(username) || !utility.isString(password) || !utility.isString(email)){
    utility.sendResponse(400, res, "missing credentials", true);
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
    return utility.sendResponse(500, res, err, true);
  }

  return utility.sendResponse(201, res, "registration successful", false);

}
