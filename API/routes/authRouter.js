'use strict'

module.exports = (expressRouter, expressApp) => {

  expressRouter.post('/login', expressApp.oauth.grant());
  expressRouter.post('/test', expressApp.oauth.authorise(), (req, res) => {
    res.send('Success');
  });

  return expressRouter;
}
