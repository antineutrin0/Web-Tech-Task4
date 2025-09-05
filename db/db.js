const mongoose=require('mongoose');
const url=process.env.MONGO_URL;


const connnectDB=async()=>{
    try{
        await mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true});
        console.log('Connected to DB');
    }catch(err){
        console.log(err);
    }
}

module.exports=connnectDB;

