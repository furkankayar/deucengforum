'use strict'

module.exports = (expressRouter, userHelper) => {


  expressRouter.put('/register', userHelper.registerUser);
  expressRouter.post('/check_email', userHelper.checkEmailUniqueness);
  expressRouter.post('/check_username', userHelper.checkUsernameUniqueness);
  expressRouter.post('/activate_user', userHelper.activateUser);


/*  expressRouter.post('/:url', (req, res) => {

    res
      .status(404)
      .json({
        code: 404,
        status: 'not found',
        bad_request: req.url
      })
  });*/
  // IF UNCOMMENT IT CATCH REQUESTS COMES TO /post etc.

  return expressRouter;
};
