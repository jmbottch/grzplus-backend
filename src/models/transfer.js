const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransferSchema = new Schema({
    value: {
        type:String,
        unique: true,
        required: [true, 'Value address is required']
        
    },

    image: {
        type: String,
        unique: false,
        required: [true, "Value name is required"]
    }
})


const Transfer = mongoose.model('transfer', TransferSchema);
module.exports = Transfer;