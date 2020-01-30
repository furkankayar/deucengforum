'use strict'


module.exports = (expressRouter, expressApp, commentHelper) => {

  expressRouter.post('/new_comment_anonymous', commentHelper.createAnonymousComment);
  expressRouter.post('/new_comment_authenticated', expressApp.oauth.authorise(), commentHelper.createAuthenticatedComment);

  return expressRouter;
}
