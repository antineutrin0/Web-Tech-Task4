const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "Minimum 3 characters required"]
        },
        lastname: {
            type: String,
            required: true,
            minlength: [3, "Minimum 3 characters required"] 
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user'         
    }
});

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign(
        { _id: this._id, role: this.role }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    return token;
}

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
