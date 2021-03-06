'use strict'

const post = {};

function postModel(sequelize, Sequelize, user){
  var Post = sequelize.define('_post', {
    post_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    topic: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    content: {
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

  Post.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'no action',
    onUpdate: 'cascade'
  });

  return Post;
};


post.PostModel = postModel;

module.exports = post;
