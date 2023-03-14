require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT= process.env.PORT || 9000;
mongoose.set("strictQuery", true);
const notFound = require('./middleware/notFound');
const authRouter = require('./routes/authRouter')
const storyRouter = require('./routes/storyRouter')
const allRouter = require('./routes/allRouter')
const auth = require('./middleware/authentication')
const cors = require("cors")
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

cloudinary.config({api_key: process.env.CLOUD_API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.CLOUD_API_SECRET
})



//middleware
app.use(cors());
app.use(fileUpload({useTempFiles: true}))
app.use(express.json());


//routes
app.use("/api/v1", authRouter);
app.use("/api/v1/story", auth, storyRouter);
//all posts regardless of users 
app.use('/api/v1/allstory', auth, allRouter)

//error route
app.use(notFound);

const start= async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        app.listen (PORT, () =>{
            console.log(`server running on port ${PORT}...`);
        })
    } catch (error) {
        console.log(error);
    }

};

start();

