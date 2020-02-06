'use strict'

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    console.log(file)
    cb(null, true);
  }
  else{
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits:{
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

module.exports = (expressRouter, expressApp, userHelper) => {


  expressRouter.put('/register', userHelper.registerUser);
  expressRouter.post('/check_email', userHelper.checkEmailUniqueness);
  expressRouter.post('/check_username', userHelper.checkUsernameUniqueness);
  expressRouter.post('/activate_user', userHelper.activateUser);
  expressRouter.post('/get_user_page', userHelper.getUserPage);
  expressRouter.post('/upload_profile_image', expressApp.oauth.authorise(), upload.single('file'), userHelper.uploadProfileImage);
  expressRouter.post('/get_profile_image', expressApp.oauth.authorise(), userHelper.getProfileImage);

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
