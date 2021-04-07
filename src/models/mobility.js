const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MobilitySchema = new Schema({
    value: {
        type:Number,
        unique: true,
        required: [true, 'Email address is required']
        
    },

    image: {
        type: String,
        unique: false,
        required: [true, "First name is required"]
    }
})


const Mobility = mongoose.model('mobility', MobilitySchema);
module.exports = Mobility;