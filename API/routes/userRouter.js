
module.exports = (expressRouter) => {

  expressRouter.get('/', (req, res) => {

    res
      .status(200)
      .json({
        code: 200,
        status: 'user test success',
      });
  });

  return expressRouter;
};
