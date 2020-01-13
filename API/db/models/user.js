'use strict'

const user = {};

function userModel(sequelize, Sequelize){
  var User = sequelize.define('_user', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  },{
    timestamps: false,
    freezeTableName: true
  });

  return User;
};

user.UserModel = userModel;

module.exports = user;
