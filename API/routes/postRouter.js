'use strict'


module.exports = (expressRouter, expressApp, postHelper) => {

  expressRouter.put('/new_post', expressApp.oauth.authorise(), postHelper.createNewPost);



  return expressRouter;
}
