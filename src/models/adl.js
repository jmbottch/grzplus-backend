const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ADLSchema = new Schema({
    value: {
        type:String,
        unique: true,
        required: [true, 'Email address is required']
        
    },

    image: {
        type: String,
        unique: false,
        required: [true, "First name is required"]
    }
})


const ADL = mongoose.model('adl', ADLSchema);
module.exports = ADL;