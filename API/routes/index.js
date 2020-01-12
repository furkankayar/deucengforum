'use strict'

/*
  What is the CORS ?

  => CORS is cross-origin source sharing. Browsers follows same origin policy (SOP)
  on http request by javascript on the client side for security. The VueApp tries to access
  api endpoints on different domain. Hence, CORS should be defined for api endpoints.
*/
const cors = require("cors");

module.exports = (expressApp, expressRouter)=>{

  let authRouter = require('./authRouter')(expressRouter, expressApp);
  let userRouter = require('./userRouter')(expressRouter);
  expressApp.use("/authentication", cors(), authRouter);
  expressApp.use("/user", cors(), userRouter);
  /*expressApp.post("/api/:url", (req, res) => {
    res
      .status(404)
      .json({
        code: 404,
        status: 'not found',
        url: req.url
      });
  });*/

  return expressRouter;
}
