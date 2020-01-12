'use strict'

const userComment = {};

function userCommentModel(sequelize, Sequelize, comment, user){
  var UserComment = sequelize.define('_user_comment', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    comment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
  },{
    timestamps: false,
    freezeTableName: true
  });

  UserComment.belongsTo(comment, {
    foreignKey: 'comment_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  UserComment.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  return UserComment;
};


userComment.UserCommentModel = userCommentModel;

module.exports = userComment;
