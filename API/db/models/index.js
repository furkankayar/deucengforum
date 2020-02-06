'use strict'

var Sequelize = require('sequelize');
var sequelize = new Sequelize('deucengforum', 'furkan', '756ee75b',
  {
    host: 'localhost',
    dialect: 'postgres',
    pool:{
      max: 5,
      min: 0,
      idle: 10000
    },
    logging: false
  });


var user = require('./user');
var UserModel = user.UserModel(sequelize, Sequelize);
var post = require('./post');
var PostModel = post.PostModel(sequelize, Sequelize, UserModel);
var comment = require('./comment');
var CommentModel = comment.CommentModel(sequelize, Sequelize, PostModel);
var userComment = require('./userComment');
var UserCommentModel = userComment.UserCommentModel(sequelize, Sequelize, CommentModel, UserModel);
var vote = require('./vote');
var VoteModel = vote.VoteModel(sequelize, Sequelize, PostModel, UserModel);
var view = require('./view');
var ViewModel = view.ViewModel(sequelize, Sequelize, PostModel, UserModel);

var postMenu = require('../views/postMenu');
var PostMenuView = postMenu.PostMenuView(sequelize,Sequelize);

require('../functions/getPost')(sequelize);
require('../functions/getCommentsOfPost')(sequelize);
require('../functions/getTopPostsOfUser')(sequelize);
require('../functions/getLastActivityOfUser')(sequelize);
require('../functions/getLikesOfUser')(sequelize);
require('../functions/getTotalViewOfUser')(sequelize);


const db = {};


// Sync models and views
let seq_models = [];
let seq_views = [];
sequelize.modelManager.forEachModel(model => {
  if (model && model.options.sync !== false) {
    seq_models.push(model);
  }
  else{
    seq_views.push(model);
  }
});
Sequelize.Promise.each(seq_models, model => {
  return model.sync();
});
Sequelize.Promise.each(seq_views, view => {
  return view.options.classMethods.createView();
});




db.UserModel = UserModel;
db.PostModel = PostModel;
db.CommentModel = CommentModel;
db.UserCommentModel = UserCommentModel;
db.VoteModel = VoteModel;
db.ViewModel = ViewModel;

db.PostMenuView = PostMenuView;

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
