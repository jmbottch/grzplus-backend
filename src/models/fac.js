const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacSchema = new Schema({
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


const Fac = mongoose.model('fac', FacSchema);
module.exports = Fac;