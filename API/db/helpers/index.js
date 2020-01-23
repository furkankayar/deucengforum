'use strict'

const bcrypt = require("bcrypt");
bcrypt.rounds = 10;

module.exports = (injectedDB, injectedRedisClient) => {
  return {
      userHelper: require("./userHelper")(injectedDB.UserModel, bcrypt),
      authHelper: require("./authHelper")(injectedDB.UserModel, bcrypt),
      postHelper: require("./postHelper")(injectedDB.PostModel, injectedDB.PostMenuView, injectedRedisClient),
  };
};
