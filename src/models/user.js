const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type:String,
        unique: true,
        required: [true, 'Email address is required']
        
    },

    firstName: {
        type: String,
        unique: false,
        required: [true, "First name is required"]
    },

    lastName : {
        type: String,
        unique: false,
        required: [true, "Last name is required"]
    },

    password: {
        type: String,
        validate: {
            validator:(password) => password.length > 9,
            message: 'Password must be at least 10 characters'
        },
        required: [true, 'password is required'],
        select: false
    },

    role: {
        type: String,
        required: [true, "Role is required"]
    }
})


const User = mongoose.model('user', UserSchema);
module.exports = User;