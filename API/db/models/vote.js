'use strict'

const vote = {};

function voteModel(sequelize, Sequelize, post, user){
  var Vote = sequelize.define('_vote', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    post_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  },{
    timestamps: false,
    freezeTableName: true
  });

  Vote.belongsTo(post, {
    foreignKey: 'post_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  Vote.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  return Vote;
};


vote.VoteModel = voteModel;

module.exports = vote;
