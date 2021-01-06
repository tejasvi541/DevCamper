const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const User = require("../models/User");
const advancedResults= require("../middleware/advancedResults");


// ===================================== Get all User ========================================//

// @desc        Get all Users
// @route       GET /api/v1/users
// @access      Private/Admin

exports.getUsers = asyncHandler (async (req,res,next)=>{

    res.status(200).json(res.advancedResults);
}); 



// ===================================== Get single User ========================================//

// @desc        Get single User
// @route       GET /api/v1/users/:id
// @access      Private/Admin

exports.getUser = asyncHandler (async (req,res,next)=>{
    const user = await User.findById(req.params.id)
    res.status(200).json({
        success : true,
        data : user
    });
}); 

// ===================================== Create a User ========================================//

// @desc        Create a User
// @route       POST /api/v1/users
// @access      Private/Admin

exports.createUser = asyncHandler (async (req,res,next)=>{

    const user = await User.create(req.body);

    res.status(201).json({
        success : true,
        data : user
    });
}); 


// ===================================== Update User ========================================//

// @desc        Update aa User
// @route       PUT /api/v1/users/:id
// @access      Private/Admin

exports.updateUser = asyncHandler (async (req,res,next)=>{
    
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators :true
    });
    res.status(200).json({
        success:true,
        data : user
    })
}); 

// ===================================== Delete a User ========================================//

// @desc        Delete a User
// @route       DELETE /api/v1/users/:id
// @access      Private/Admin

exports.deleteUser = asyncHandler (async (req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);


    res.status(200).json({
        success:true,
        data : {
        }
    });
}); 
