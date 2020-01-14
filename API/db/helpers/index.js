'use strict'

const bcrypt = require("bcrypt");
bcrypt.rounds = 10;

module.exports = (injectedDB) => {
  return {
      userHelper: require("./userHelper")(injectedDB.UserModel, bcrypt),
      authHelper: require("./authHelper")(injectedDB.UserModel, bcrypt),
  };
};
