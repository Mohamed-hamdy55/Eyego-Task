const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.isAuthenticated = catchAsyncErrors(async(req,res,next) => {
    const {eyego_token} = req.cookies;

    if(!eyego_token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    try {
        const decodedUser = jwt.verify(eyego_token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decodedUser.id);
        if (!req.user) {
            throw "Invalid token, Please login again";
        }
        next();
    } catch (error) {
        return next(new ErrorHandler(error, 401));
    }
});