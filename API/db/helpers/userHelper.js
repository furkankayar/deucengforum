'use strict'

const utility = require('../../utility');
let userModel;
let bcrypt;
let nodemailer;
let crypto;
let redisClient;
let sequelize;

module.exports = (injectedUserModel, injectedBcrypt, injectedNodemailer, injectedCrypto, injectedRedisClient, injectedSequelize) => {

  userModel = injectedUserModel;
  bcrypt = injectedBcrypt;
  nodemailer = injectedNodemailer;
  crypto = injectedCrypto;
  redisClient = injectedRedisClient;
  sequelize = injectedSequelize;

  return {
    getUserFromCredentials: getUserFromCredentials,
    registerUser: registerUser,
    checkEmailUniqueness: checkEmailUniqueness,
    checkUsernameUniqueness: checkUsernameUniqueness,
    activateUser: activateUser,
    getUserPage: getUserPage,
    uploadProfileImage: uploadProfileImage,
    getProfileImage: getProfileImage,
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

async function getUserPage(req, res){

  let userId = req.body.userId;

  if(!utility.isString(userId) || isNaN(userId)){
    return utility.sendResponse(400, res, "missing or invalid user id", true);
  }

  try{
    let user = await userModel.findOne({
      where:{
        user_id: userId
      }
    });

    if(user === undefined || user === null){
      return utility.sendResponse(404, res, "user not found", true);
    }

    let last_activity = await sequelize.query('SELECT * FROM get_last_activity_of_user(:user_id)',
      {
        plain: true,
        replacements: { user_id: userId }
      }
    );

    let likes = await sequelize.query('SELECT * FROM get_likes_of_user(:user_id)',
      {
        plain: true,
        replacements: { user_id: userId }
      }
    );

    let topPosts = await sequelize.query('SELECT * FROM get_top_posts_of_user(:user_id)',
      {
        replacements: { user_id: userId }
      }
    );

    if(topPosts !== null && topPosts !== undefined){
      topPosts = topPosts[0];
    }

    let totalView = await sequelize.query('SELECT * FROM get_total_view_of_user(:user_id)',
      {
        plain: true,
        replacements: { user_id: userId }
      }
    );


    return utility.sendResponse(200, res, {
      username: user.username,
      profile_image: user.profile_image,
      last_activity: last_activity,
      likes: likes,
      total_view: totalView,
      top_posts: topPosts
    }, false);
  }
  catch(err){

    return utility.sendResponse(500, res, "database error", true);
  }
}

function uploadProfileImage(req, res){

  let token = req.headers.authorization;

  if(!utility.isString(token)){
    return utility.sendResponse(200, res, "token required", true);
  }



  if(req.file === null || req.file === undefined){
    return utility.sendResponse(200, res, "error occured while storing image", true);
  }

  redisClient.get(token.substr(7), (err, rawResponse) => {

    if(err || rawResponse === null){
      return utility.sendResponse(500, res, "session error", true);
    }

    let response = JSON.parse(rawResponse);
    let user_id = response.user_id;

    userModel.findOne({
      where: user_id
    })
      .then(user => {
        user.update({
          profile_image: 'http://localhost:8000/uploads/' + req.file.filename
        })
        .then(ans => {
          return utility.sendResponse(200, res, "profile image updated", false);
        })
        .catch(err => {
          return utility.sendResponse(500, res, "database error", true);
        });
      })
      .catch(err => {
        return utilitu.sendResponse(500, res, "database error", true);
      });
  });
}

function getProfileImage(req, res){

  let token = req.headers.authorization;

  if(!utility.isString(token)){
    return utility.sendResponse(200, res, "token required", true);
  }

  redisClient.get(token.substr(7), (err, rawResponse) => {

    if(err || rawResponse === null){
      return utility.sendResponse(500, res, "session error", true);
    }

    let response = JSON.parse(rawResponse);
    let user_id = response.user_id;

    userModel.findOne({
      where: user_id,
      raw: true
    })
      .then(user => {
        return utility.sendResponse(200, res, user.profile_image, false);
      })
      .catch(err => {
        return utility.sendResponse(500, res, "database error", true);
      })
  });
}
