'use strict'

const view = {};

function viewModel(sequelize, Sequelize, post, user){
  var View = sequelize.define('_view', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    post_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  },{
    timestamps: false,
    freezeTableName: true
  });

  View.belongsTo(post, {
    foreignKey: 'post_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  View.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  return View;
};


view.ViewModel = viewModel;

module.exports = view;
