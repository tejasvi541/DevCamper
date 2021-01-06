const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const User = require("../models/User");
const sendMail = require("../utils/sendEmail");

// ===================================== Register User ========================================//

// @desc        Register User
// @route       POST /api/v1/auth/register
// @access      Public

exports.register = asyncHandler (async (req,res,next)=>{

    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
}); 

// ===================================== Login User ========================================//

// @desc        Login User
// @route       POST /api/v1/auth/login
// @access      Public

exports.login = asyncHandler (async (req,res,next)=>{

    const { email, password} = req.body;

    // Validates email & password 
    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and passowrd', 400));
    }

    //check for user 
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return next(new ErrorResponse('Invalid Credentials', 401));

    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    sendTokenResponse(user, 200, res); 

}); 



// =====================================GET LoggedIn User ========================================//

// @desc        Get current logged in User
// @route       POST /api/v1/auth/login
// @access      Private

exports.getMe = asyncHandler (async (req,res,next)=>{
    
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success :true,
        data : user
    });
    
}); 

// ===================================== Update LoggedIn User ========================================//

// @desc        Update User details
// @route       PUT /api/v1/auth/updatedetails
// @access      Private

exports.updateDetails = asyncHandler (async (req,res,next)=>{
    const fieldsToUpdate = {
        name : req.body.name,
        email : req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new : true,
        runValidators:true
    });
    
    res.status(200).json({
        success :true,
        data : user
    });
    
}); 

// ================================== Update LoggedIn User's Password =================================//

// @desc        Update Password
// @route       PUT /api/v1/auth/updatepassword
// @access      Private

exports.updatepassword = asyncHandler (async (req,res,next)=>{
    
    const user =  await User.findById(req.user.id).select("+password");

    // check current password
    if(! (await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse(`Password is incorrect`, 401));
    }
    user.password = req.body.newPassword;

    await user.save();

    sendTokenResponse(user, 200, res); 
    
}); 

// ===================================== Forgot password ========================================//

// @desc        Forgot Password 
// @route       POST /api/v1/auth/forgotpassword
// @access      Public

exports.forgotPassword = asyncHandler (async (req,res,next)=>{

const user = await User.findOne({ email : req.body.email});

if(!user){
    return next(
        new ErrorResponse(`There is no user with email ${req.body.email}`, 404)
        );
    }
    
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    
    await user.save( {  validateBeforeSave:false  } );
    //create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`; 
    
    
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    
    try {
        await sendMail({
            email : user.email,
            subject: `Password reset token`,
            message
        });
        
        res.status(200).json({ success:true, data: "Email Sent" });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save({validateBeforeSave : false});
        
        return next(new ErrorResponse(`Email couldn't be sent`), 500);
    }
    
    // console.log(resetToken); 
    
    res.status(200).json({
        success :true,
        data : user
    });
    
});

// ===================================== Reset Password ========================================//

// @desc        Get current logged in User
// @route       PUT /api/v1/auth/resetpassword/:resettoken
// @access      Public

exports.resetPassword = asyncHandler (async (req,res,next)=>{
    // Get hashed token     
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    

    const user = await User.findOne({resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    });
    
    if(!user){
        return next(new ErrorResponse(`Invalid Token`,400));
    }

    // Set new Password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
    
});



// Get token from model and create cookie and send response
const sendTokenResponse = (user, statusCode, res) =>{

    // Create Token
    const token = user.getSignedJwtToken();

    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60*60 *1000),
        httpOnly : true
    };

    // https in production
    if(process.env.NODE_ENV === 'productions'){
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success:true,
            token
        });
}