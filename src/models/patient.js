const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
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

    dateOfBirth: {
        type: Date,
        required: [true, "Date of Birth is required"]
    },

    roomNr : {
        type : String,
        required: [true, 'Roomnumber is required']
    },

    dateOfDeparture : {
        type: Date,
        required: false
    },

    comments : [{
        author : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        content : {
            type : String
        }
    }],

    //shared informatie
    exercises : [{
        title :{
            type : String,
            required : [true, 'title is required']
        },
        description :{
            type : String,
            required : false
        },
        link : {
            type : String,
            required : false
        }
    }],

    practitioners : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required : [true, 'Patient must have at least one pactitioner']
    }],
    
    appointments : [{
        date: {
            type:Date,
            required: [true, 'Date is required']
            
        },
    
        description : {
            type: String,
            required: [true, "Description is required"]
        },
    
        practitioner: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'user',
            required: [true, 'Practitioner is required'],
            
        }
    }],

    resuscitation : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'resuscication',        
    },

    // Class mobility moet zijn id + beschrijving + icon
    mobilityInRoom : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mobility',
        // required: [true, 'Mobility in Room is required']
    },
    mobilityOnDepartment : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mobility',
        // required: [true, 'Mobility on Department is required']
    },
    mobilityOffDepartment : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mobility',
        // required: [true, 'Mobility on Department is required']
    },

    //informatie voor dietist
    // + exercises practitioners appointments

    dietAdvice : {
        type : String,
        required : [false]
    },

    swallowAdvice : {
        type: String,
        required : [false]
    },

    //info voor fysio
    // + exercises practitioners appointments mobility


    //class Transfer moet zijn id + beschrijving + plaatje
    // transfer : {
    //     type : Transfer,
    //     required : false
    // },

    goalOfTheWeek : {
        type : String,
        required : false
    },

    // adl : {
    //     showeringTop : {
    //         type : Number,
    //         required : false
    //     },
    //     showeringBottom : {
    //         type : Number,
    //         required : false
    //     },
    //     washingTop : {
    //         type : Number,
    //         required : false
    //     },
    //     washingBottom : {
    //         type : Number,
    //         required : false
    //     },
    //     dressingTop : {
    //         type : Number,
    //         required : false
    //     },
    //     dressingBottom : {
    //         type : Number,
    //         required : false
    //     },
    //     toilet : {
    //         type : Number,
    //         required : false
    //     },
    //     bed : {
    //         type : Number,
    //         required : false
    //     }
    // }

    // cognitieve begeleiding??

    //info voor ergo


})


const Patient = mongoose.model('patient', PatientSchema);
module.exports = Patient;