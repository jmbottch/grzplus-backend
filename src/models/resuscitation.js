const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResuscitationSchema = new Schema({
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


const Resuscitation = mongoose.model('resuscication', ResuscitationSchema);
module.exports = Resuscitation;