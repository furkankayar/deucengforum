'use strict'

const utility = require('../../utility');
let userModel;
let bcrypt;
let nodemailer;
let crypto;
let redisClient;

module.exports = (injectedUserModel, injectedBcrypt, injectedNodemailer, injectedCrypto, injectedRedisClient) => {

  userModel = injectedUserModel;
  bcrypt = injectedBcrypt;
  nodemailer = injectedNodemailer;
  crypto = injectedCrypto;
  redisClient = injectedRedisClient;

  return {
    getUserFromCredentials: getUserFromCredentials,
    registerUser: registerUser,
    checkEmailUniqueness: checkEmailUniqueness,
    checkUsernameUniqueness: checkUsernameUniqueness,
    activateUser: activateUser
  };
};


async function getUserFromCredentials(username, password){

  let user = await userModel.findOne({
    where: {
      username: username
    }
  });

  if(user != null && bcrypt.compareSync(username + password, user.password)){
    return user;
  }

  return null;
}

async function checkUsernameUniqueness(req, res){

  let username = req.body.username;
  let user;

  if(!utility.isString(username) || username === ''){
    return utility.sendResponse(400, res, "missing username", true);
  }

  try{
    user = await userModel.findOne({
      where: {
        username: username
      }
    });
  }
  catch(err){
    return utility.sendResponse(500, res, "database error", true);
  }

  if(user){
    return utility.sendResponse(200, res, "username exists", true);
  }

  return utility.sendResponse(200, res, "username does not exist", false);
}

async function checkEmailUniqueness(req, res){

  let email = req.body.email;
  let user;


  if(!utility.isString(email) || email === ''){
    return utility.sendResponse(400, res, "missing email", true);
  }

  try{
    user = await userModel.findOne({
      where: {
        email: email
      }
    });
  }
  catch(err){
    return utility.sendResponse(500, res, "database error", true);
  }

  if (user) {
    return utility.sendResponse(200, res, "email exists", true);
  }

  return utility.sendResponse(200, res, "email does not exist", false);
}

async function registerUser(req, res){

  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  if(!utility.isString(username) || !utility.isString(password) || !utility.isString(email)){
    return utility.sendResponse(400, res, "missing credentials", true);
  }

  try{
    let hash = bcrypt.hashSync(username + password, bcrypt.rounds);
    await userModel.create({
      username: username,
      password: hash,
      email: email
    });
  }
  catch(err){
    return utility.sendResponse(500, res, "database error", true);
  }

  let token = crypto.randomBytes(50).toString('hex');
  let store = JSON.stringify({
    username: username,
    email: email
  });

  redisClient.select(1, (err, resp) => {
    redisClient.setex(token, 3600000, store);
  });

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
      user: 'dbms.info.test@gmail.com',
      pass: '123123123Db'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'dbms.info.test@gmail.com',
    to: `${email}`,
    subject: `Account activation`,
    text: `Click link to activate your account: http://localhost:8080/validation/${token}\n`
  }

  try{
    await transporter.sendMail(mailOptions, (err, resp) => {
      if(err){
        return utility.sendResponse(200, res, "email error", true);
      }
      else{
        return utility.sendResponse(200, res, "success", false);
      }
    });
  }
  catch(err){
    return utility.sendResponse(200, res, "email error", true);
  }
}

function activateUser(req, res){

  let token = req.body.token;

  if(!utility.isString(token)){
    return utility.sendResponse(400, res, "missing token", true);
  }

  redisClient.select(1, (err, resp) => {
    if(err){
      return utility.sendResponse(500, res, "error", true);
    }
    else{
      redisClient.get(token, (err, session) => {
        if(err){
          return utility.sendResponse(500, res, "error", true);
        }
        else{
          if(session === null){
            return utility.sendResponse(500, res, "invalid token", true);
          }
          else{
            let sessionObj = JSON.parse(session);
            userModel.findOne({
              where: {
                username: sessionObj.username
              }
            })
              .then(user => {
                user.update({
                  is_active: true
                })
                  .then(ans => {
                    if(ans){
                      redisClient.del(token, (err, result) =>{
                        if(err){
                          console.log('Error occured while token is deleted: ' + token);
                        }
                      });
                      return utility.sendResponse(200 ,res, "success", false);
                    }
                    return utility.sendResponse(500, res, "error", true);
                  })
                  .catch(err => {
                    return utility.sendResponse(500, res, "database error", true);
                  })
              })
              .catch(err => {
                return utility.sendResponse(500, res, "database error", true);
              })
          }
        }
      });
    }
  });
}
