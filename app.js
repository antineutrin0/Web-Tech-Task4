const dotenv= require('dotenv').config();
const express=require('express')
const app=express();
const cookieParser=require('cookie-parser')
const cors=require('cors')
const connectDB=require('./db/db')
app.use(cookieParser());
app.use(cors());
app.use(express.json());
connectDB();
const PORT=process.env.PORT || 5000;
app.use('/api/users',require('./routes/user'))
app.use('/api/admin',require('./routes/admin'))


app.listen(PORT,console.log(`server is running on port ${PORT}`))