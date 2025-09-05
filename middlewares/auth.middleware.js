const userModel=require('../models/User.model');
const blacklistTokenModel=require('../models/blacklistToken.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');    
const captainModel = require('../models/captain.model');


const authUser = async (req, res,next) => {
    const token=req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized user"});
    }
      const isBlacklisted = await blacklistTokenModel.findOne({'token':token});
    if(isBlacklisted){
        return res.status(401).json({message:"Unauthorized user"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        req.user=user;
        return next();
    }
    catch(err){
        return res.status(401).json({message:"Unauthorized user"});
    }
}

const authCaptain=async (req, res,next) => {
    const token=req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized user"});
    }
    const isBlacklisted = await blacklistTokenModel.findOne({'token':token});
    if(isBlacklisted){
        return res.status(401).json({message:"Unauthorized user"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        if(!captain){
            return res.status(404).json({message:"Captain not found"});
        }
        req.captain=captain;
        return next();
    }
    catch(err){
        return res.status(401).json({message:"Unauthorized user"});
    }
}

module.exports = {
    authUser,
    authCaptain
};
