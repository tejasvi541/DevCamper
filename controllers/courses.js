const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");


//=======================================GET Courses=============================================//

// @desc        Get courses
// @route       GET /api/v1/courses                                 // Route for all courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses           // Route for all courses coresponding to a specific bootcamp
// @access      Public

exports.getCourses = asyncHandler( async (req,res,next) =>{
    let query;
    
    if(req.params.bootcampId){
        query = Course.find( {bootcamp : req.params.bootcampId});
    }else{
        query = Course.find().populate({
            path : 'bootcamp',
            select : 'name description'
        });
    }

    const courses = await query;

    res.status(200).json(
        {
            success : true,
            count : courses.length,
            data : courses
        }
    );
});