'use strict'

let userModel;
let bcrypt;

module.exports = (injectedUserModel, injectedBcrypt) => {

  userModel = injectedUserModel;
  bcrypt = injectedBcrypt;

  return {
    getUserFromCredentials: getUserFromCredentials,
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
