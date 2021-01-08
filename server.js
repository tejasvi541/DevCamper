const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const xssClean = require("xss-clean");
const cors = require("cors");
const fileupload = require("express-fileupload");
const connectDB = require("./config/db");
const errorHandler = require('./middleware/error');


// Load env vars
dotenv.config({path:"./config/config.env"});

// Connect to Database
connectDB();


// Route Files

const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');



// Initialising Express Constructor
const app = express();

// Body Parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Development logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Adding headers for XSS protection
app.use(helmet());

// Cross site scripting attacks
app.use(xssClean());

// Rate limiting
const limiter = rateLimit({
    windowMs : 10*60*1000,
    max:1000
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enabling cross origin resource sharing
app.use(cors());

//File Uploading middleware
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// ================Mount routes=====================
                                                  
app.use('/api/v1/bootcamps', bootcamps);          
app.use('/api/v1/courses', courses);           
app.use('/api/v1/auth', auth );           
app.use('/api/v1/users', users );           
app.use('/api/v1/reviews', reviews );           
                                                  
                                                  
// =================================================

// Error handler middleware (Should be after mounting routes as otherwise it will not be able to
// errors otherwise)
app.use(errorHandler);




const PORT = process.env.PORT || 5000;
const server = 
    app.listen(PORT, console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
        .yellow.bold));

// Handel unhandelled promise rejections
process.on('unhandledRejection', (err)=>{
    console.log(`Error : ${err.message}`.red);
    // Close Server & Exit process
    server.close(()=> process.exit(1));
});