const User = require("../model/user");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const jwtToken = require("../utils/JwtToken");
const sendMail = require("../utils/SendMail");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");

//==================================================================================================

/**
 * Create user request: that take the user information in registeration
 *  - if the user is already registred then call ErrorHandler()
 *  - if new user then send this prending user an ctivation email , sign this userto an activation token
 *  - the user will not be created and addeb to db untill he/she complete verification
 *  - only file avatar will be saved in uploads and atached to the prending user
 */
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || !req.file) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }


    const userEmail = await User.findOne({ email });
    if (userEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("User: Error in deleting image");
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileURL = process.env.SERVER_IMAGE_URL +"/" + path.join(filename);
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileURL,
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`; // real server url will be here

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, Please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};


/**
 * activation function: create activation token for pending user
 * the expire time is only 5m, so user has only 5m to verify his account
 * @param {*} user
 * @returns
 */
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};


/**
 * activate new user account request: that take the user information for the target pending user with this activation token
 *  - if the activation token is notexpired and verified successfuly complete the process
 *  - if the user is already registred: then call ErrorHandler() and return error already exist
 *  - if new user: then create the user object and store it to db
 */
exports.activateUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
  
    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const { name, email, password, avatar} = newUser;
    
    const userEmail = await User.findOne({ email });
    
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }
    const user = await User.create({
      name,
      email,
      avatar,
      password,
    });

    res.status(201).json({
      success: true,
      message: `Wooooo! activation successfully completed, thanks ${user.name}`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//==================================================================================================

/**
 * Login request: that take the user information in login form (email, password)
 *  - if the data is empty, return error to notify user to provide all details
 *  - if the user is not registred, retrun error to noftify user that he must signed in first
 *  - if user password is wrong, retrun error to noftify user that he procide a wrong password
 *  - if all user's data is valid: then complete the login proces, create token and save the login token in cookies
 */
exports.login = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User doesn't exist!", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Please Provide the correct password", 400));
    }

    const { token, options } = jwtToken(user);

    user.password = undefined;
    res.status(200).cookie("eyego_token", token, options).json({
      success: true,
      message:"Login Success!",
      user,
      token,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//==================================================================================================

/**
 * Forget password request: it takes the user email and create a forget-password-token then send this 
 *                           token link in email
 */
exports.handleForgetPassword = catchAsyncErrors(async(req,res,next)=>{
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler("Please enter the email!", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }

    const forgetPasswordToken = createForgetPasswordToken(user);
    const forgetPasswordUrl = `http://localhost:3000/create-new-password/${forgetPasswordToken}`; // real server url will be here

    try {
      await sendMail({
        email: user.email,
        subject: "Create New Password",
        message: `Hello ${user.name}, Please click on the link to create your new password: ${forgetPasswordUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email to create new password, you have only 30 minutes !`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

/**
 * create forget password token function: create forget-password-token for user that alreadt exist
 * the expire time is only 10m, so user has only 30m to change his password
 * @param {*} user
 * @returns
 */
const createForgetPasswordToken = (user) => {
  // because the user object from mongodb  contains properties or methods that aren't serializable
  const payload = { id: user._id, email: user.email };
  return jwt.sign(payload, process.env.Forget_Password_SECRET, {
    expiresIn: "30m",
  });
};

/**
 * create new password request: that take the user information for the target  user with this forget password token
 *  - if the forget password token is not expired and verified successfuly complete the process
 *  - if the user is not exist: then call ErrorHandler() and return error not exist
 *  - if exist user: then create new password and update the password attribute in the user
 */
exports.createNewPassword = catchAsyncErrors(async(req,res,next)=>{ 
  try {
    const { password, forget_password_token } = req.body;

    const tokenUser = jwt.verify(forget_password_token, process.env.Forget_Password_SECRET);

    if (!tokenUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const { email} = tokenUser;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not exist!", 400));
    }

    user.password = password;

    await user.save();

    res.status(201).json({
      success: true,
      message: `Password updated successfully`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//==================================================================================================

/**
 * Get user request: that verifying that user has already logged in, and retrun user data
 *  - if user has not logged in, return a message to notify the user that he has to logged in first to make some actions
 *  - if the user has already logged in, so it has the privilage to make users actions
 *  - "isAuthenticated" middleware is responsple for handle token verfication
 */
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  try {
        
    const user = await User.findById(req.user.id);

    if(!user){
      return next(new ErrorHandler("User doesn't exist", 400));
    }
    
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


/**
 * Logout request: that logged out the user from the website by adding the token in cookies to be null
 */
exports.logout = catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("eyego_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
//==================================================================================================
