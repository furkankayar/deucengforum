'use strict'


module.exports = (expressRouter, expressApp, commentHelper) => {

  expressRouter.post('/new_comment_anonymous', commentHelper.createAnonymousComment);

  return expressRouter;
}
