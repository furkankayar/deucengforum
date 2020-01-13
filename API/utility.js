'use strict'

module.exports = {

  sendResponse: sendResponse,
  isString: isString,
  
}

function sendResponse(code, res, message, error){

  res
    .status(code)
    .json({
      'code': code,
      'body': message,
      'error': error,
    });
}

function isString(parameter){

  return parameter != null && (typeof parameter === "string" || paramater instanceof String) ? true : false;
}
