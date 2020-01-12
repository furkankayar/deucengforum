'use strict'

module.exports = (expressRouter) => {

  expressRouter.post('/', (req, res) => {
    console.log(req.body.grant_type);
    res.redirect(307, '/user/unauthorized');
    /*res
      .status(200)
      .json({
        code: 200,
        status: 'user test success',
      });*/
  });

  expressRouter.post('/unauthorized', (req, res) => {

    res.
      status(401)
      .json({
        code: 401,
        status: 'unauthorized',
      });
  });

  expressRouter.post('/:url', (req, res) => {

    res
      .status(404)
      .json({
        code: 404,
        status: 'not found',
        bad_request: req.url
      })
  });

  return expressRouter;
};
