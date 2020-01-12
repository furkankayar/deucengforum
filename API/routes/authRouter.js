'use strict'

module.exports = (expressRouter, expressApp) => {

  expressRouter.post('/login', expressApp.oauth.grant());

  return expressRouter;
}
