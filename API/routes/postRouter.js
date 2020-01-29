'use strict'


module.exports = (expressRouter, expressApp, postHelper) => {

  expressRouter.put('/new_post', expressApp.oauth.authorise(), postHelper.createNewPost);
  expressRouter.post('/get_posts', postHelper.getPosts);
  expressRouter.post('/get_post', postHelper.getPost);
  expressRouter.post('/get_comments_of_post', postHelper.getCommentsOfPost);

  return expressRouter;
}
