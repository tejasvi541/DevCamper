const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title:{
        type : String,
        trim : true,
        required : [true, "Please add a course title"],
        
    },
    
    description : {
        type : String,
        required : [true, "Please add a description"]
    },

    weeks : {
        type : String,
        required : [true, "Please add number of weeks"]
    },

    tuition : {
        type : Number,
        required : [true, "Please add a tuition cost"]
    },

    minimumSkill : {
        type : String,
        required : [true, "Please add minimum Skill"],
        enum : [
            'beginner',
            'intermediate',
            'advanced'
        ]
    },

    scholarshipAvailable : {
        type : Boolean,
        default : false
    },

    createdAt : {
        type : Date,
        default : Date.now
    },

    // relationship between Bootcamps and courses
    // Adding bootcamp field
    bootcamp : {
        type : mongoose.Schema.ObjectId,
        ref : "Bootcamp",
        required : true
    }
    

});


module.exports = mongoose.model("Course", CourseSchema)