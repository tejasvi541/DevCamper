
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const path = require("path");
const { log } = require("console");
const advancedResults = require("../middleware/advancedResults");
const User = require("../models/User");

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

    // Create Token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success : true,
        token
    });
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

    // Create Token

    const token = user.getSignedJwtToken();

    res.status(200).json({
        success : true,
        token
    });
}); 