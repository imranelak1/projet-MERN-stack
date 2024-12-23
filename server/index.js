const express= require('express');
const dotenv=require('dotenv').config()
const cors =require('cors')
const mongoose=require('mongoose')
const app=express();
const cookieParser=require('cookie-parser')
//database
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('DATABASE CONNECTED'))
.catch((err)=>console.log('DATABASE NOT CONNECTED',err))

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))




app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/taskRoutes'))

const port=8000;
app.listen(port,()=>console.log(`Server is running on ${port}`))