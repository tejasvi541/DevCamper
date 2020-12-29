const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

// Database Schema
const BootcampSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please add a name"],
        unique : true,
        trim : true,
        maxlength : [50, "Name cannot be more than 50 characters"]
    },

    // slug is a URL friendly name
    slug : String,
    description: {
        type : String,
        required : [true, "Please add a description"],
        maxlength : [500, "Description cannot be more than 500 characters"]
    },

    website : {
        type : String,
        match : [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please Return a Valid URL with HTTP or HTTPS"
        ]
    },

    phone : {
        type : String,
        maxlength : [20, "Phone number cannot be more than 20 characters"]
    },

    email : {
        type : String,
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please add a valid Email"
        ]
    },

    address : {
        type : String,
        required : [true, "Please add an address"]
    },

    location : {
        // GeoJSON Point
        type : {
            type : String,
            enum : ["Point"],
            // required : true
        },

        coordinates : {
            type : [Number],
            // required : true,
            index : "2dsphere"
        },

        formattedAddress : String,
        street : String,
        city : String,
        state : String,
        zipcode : String,
        country : String
    },

    careers : {
        // array of Strings
        type : [String],
        required : true,
        enum : [
            'Web Development',
            "Mobile Development",
            "UI/UX",
            "Data Science",
            "Machine Learning Engineer",
            "Software Developer",
            "Business",
            "Others"
        ]
    },

    averageRating : { 
        type : Number,
        min: [1, "Rating must be atleast 1"],
        max : [10, "Rating must be atmost 10"]
    },

    averageCost : Number,

    photo : {
        type : String,
        default : "no-photo.jpg"
    },

    housing : {
        type : Boolean,
        default : false
    },

    jobAssistance : {
        type : Boolean,
        default : false

    },

    jobGuarantee : {
        type : Boolean,
        default : false
    },

    acceptGi : {
        type : Boolean,
        default : false
    },

    createdAt : {
        type : Date,
        default : Date.now
    }


}); 

// Create Bootcamp slug from a name
BootcampSchema.pre("save", function(next){
    this.slug = slugify(this.name, {lower : true});
    next();
});

// Geocode & create location field Middleware
BootcampSchema.pre("save", async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type : "Point",
        coordinates : [loc[0].longitude, loc[0].latitude],
        formattedAddress : loc[0].formattedAddress,
        street : loc[0].streetName,
        city : loc[0].city,
        state : loc[0].stateCode,
        zipcode : loc[0].zipcode,
        country : loc[0].countryCode,

    }

    // Do not save address
    this.address = undefined;
    next();
});


module.exports = mongoose.model("Bootcamp", BootcampSchema)