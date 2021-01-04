
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
});