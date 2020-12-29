const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");


//===============================  Get all Bootcamps  ========================================//

// @desc        Get all Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req,res,next) =>{

        const bootcamps = await Bootcamp.find();

        res.status(200).json({
            success:true,
            count : bootcamps.length,
            data:bootcamps
        });
     
});

//============================= Get Single Bootcamp ==============================================//

// @desc        Get Single Bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req,res,next) =>{

        const bootcamp = await Bootcamp.findById(req.params.id);
        
        if(!bootcamp){
            return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success:true,
            data:bootcamp
        });
    
});

//================================= Crete new Bootcamp =========================================//

// @desc        Crete new Bootcamp
// @route       POST /api/v1/bootcamps/
// @access      Private
exports.createBootcamp = asyncHandler(async (req,res,next) =>{
    
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
        success : true,
        data: bootcamp
    });    
});

//================================= Update Bootcamp ==========================================//

// @desc        Update Bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req,res,next) =>{

            const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
                new : true,
                runValidators : true
            });
            if(!bootcamp){
                return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
            }
            res.status(201).json({
                success : true,
                data: bootcamp
            });
        
});

//================================= Delete Bootcamp ==========================================//

// @desc        Delete Bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req,res,next) =>{
  
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(201).json({
            success : true,
            data: {}
        });

});

//===========================================================================================//