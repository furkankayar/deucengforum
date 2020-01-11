'use strict'

/*
  What is the CORS ?

  => CORS is cross-origin source sharing. Browsers follows same origin policy (SOP)
  on http request by javascript on the client side for security. The VueApp tries to access
  api endpoints on different domain. Hence, CORS should be defined for api endpoints.
*/
const cors = require("cors");

module.exports = (expressApp, expressRouter)=>{

  expressApp.use("/api/user", cors(), require('./userRouter')(expressRouter));

  return expressRouter;
}
