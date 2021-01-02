const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");
const path = require("path");
const { log } = require("console");
// const { delete } = require("../routes/bootcamps");


//===============================  Get all Bootcamps  ========================================//

// @desc        Get all Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req,res,next) =>{
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        //Sort +1 for ascending and -1 for descending
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }else{
            query = query.sort("-createdAt")
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;

            // to skip certain amount of resources
        const startIndex = (page-1)*limit;

        const endIndex = page*limit;
        const total = await Bootcamp.countDocuments();

        query = query.skip(startIndex).limit(limit);


        // Executing Query
        const bootcamps = await query;

        // Pagination Result
        const pagination = {};

        if (endIndex<total) {
            pagination.next = {
                page : page+1,
                limit
            }
        }

        if(startIndex>0){
            pagination.prev = {
                page:page-1,
                limit
            }
        }

        res.status(200).json({
            success:true,
            count : bootcamps.length,
            pagination,
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
  
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        // This will trigger the cascade middleware.
        bootcamp.remove();
        res.status(201).json({
            success : true,
            data: {}
        });

});

//========================Get Bootcamps Within a radius======================================//

// @desc        Get Bootcamps Within a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
exports.getBootcampsInRadius = asyncHandler(async (req,res,next) =>{
  
    const  { zipcode, distance } = req.params;

    // GET lat/lng from geocoder 

    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc Radius using radians
    // Divide distance by radius of earth (3,963 miles)
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location : { $geoWithin : { $centerSphere: [[ lng, lat], radius] } },
    });

    res.status(200).json({
        success:true,
        count : bootcamps.length,
        data:bootcamps
    });
}); 

//===========================================================================================//



//================================= Upload photo for Bootcamp ==========================================//

// @desc        Upload photo for Bootcamp
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      Private
exports.bootcampPhotoUpload = asyncHandler(async (req,res,next) =>{
  
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        
        if(!req.files){
            return next(new ErrorResponse(`Please upload a file`, 400));
        }

        const file = req.files.file;

        // Make sure that the file is a photo
        if(!file.mimetype.startsWith('image')){

            return next(new ErrorResponse(`Please upload a photo`, 400));
        }

        //check Filesize
        if(file.size > process.env.MAX_FILE_UPLOAD){

            return next(new ErrorResponse(`Please upload an image of less than ${process.env.MAX_FILE_UPLOAD}`, 400));
        }

        // Create custom file name
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
          
            if(err){
                console.log(err);
                return next(new ErrorResponse(`Problem with file upload ${process.env.MAX_FILE_UPLOAD}`, 400));

            }
            await Bootcamp.findByIdAndUpdate(req.param.id, {photo : file.name});
            res.status(200).json({
                success : true, 
                data : file.name
            })
        });
});
