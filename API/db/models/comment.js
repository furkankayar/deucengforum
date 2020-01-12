'use strict'

const comment = {};

function commentModel(sequelize, Sequelize, post){
  var Comment = sequelize.define('_comment', {
    comment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    post_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    body: {
      type: Sequelize.STRING(500),
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    }
  },{
    timestamps: false,
    freezeTableName: true
  });

  Comment.belongsTo(post, {
    foreignKey: 'post_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  return Comment;
};


comment.CommentModel = commentModel;

module.exports = comment;
