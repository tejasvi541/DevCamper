const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({path:"./config/config.env"});

// Connect to Database
connectDB();


// Route Files

const bootcamps = require("./routes/bootcamps");



// Initialising Express Constructor
const app = express();

// Body Parser
app.use(express.json());

// Development logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


// ================Mount routes=====================
                                                  
app.use('/api/v1/bootcamps', bootcamps)           
                                                  
                                                  
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