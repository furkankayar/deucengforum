'use strict'

module.exports = (expressRouter, expressApp, authHelper) => {

  expressRouter.post('/login', (req, res, next) => {

    let username = req.body.username;
    let password = req.body.password;

    authHelper.login(username, password, (ret) => {
      if(ret === false){
        res
          .status(200)
          .json({
            code: 200,
            body: 'not_active',
            error: true
          });
      }
      else{
        expressApp.oauth.grant()(req, res, next);
      }
    });
  });

  expressRouter.post('/check_authentication', expressApp.oauth.authorise(), authHelper.checkAuthentication);

  return expressRouter;
}
