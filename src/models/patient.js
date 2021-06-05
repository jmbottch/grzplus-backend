const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const opts = {
    // Make Mongoose use Unix time (seconds since Jan 1, 1970)
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
};

const PatientSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email address is required']

    },

    firstName: {
        type: String,
        unique: false,
        required: [true, "First name is required"]
    },

    lastName: {
        type: String,
        unique: false,
        required: [true, "Last name is required"]
    },

    password: {
        type: String,
        validate: {
            validator: (password) => password.length > 9,
            message: 'Password must be at least 10 characters'
        },
        required: [true, 'password is required'],
        select: false
    },

    dateOfBirth: {
        type: Date,
        required: [true, "Date of Birth is required"]
    },    

    dateOfDeparture: {
        type: Date,
        required: false
    },

    comments: [{
        type: new mongoose.Schema({
            author: {
                type: String
            },
            content: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now,
                required: true
            }
        })

    }],

    //shared informatie
    exercises: [{
        title: {
            type: String,
            required: [true, 'title is required']
        },
        description: {
            type: String,
            required: false
        },
        link: {
            type: String,
            required: false
        }
    }],

    practitioners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        // required : [true, 'Patient must have at least one pactitioner']
    }],

    appointments: [{
        date: {
            type: Date,
            required: [true, 'Date is required']

        },

        description: {
            type: String,
            required: [true, "Description is required"]
        },

        practitioner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: [true, 'Practitioner is required'],

        }
    }],

    resuscitation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'resuscication',
    },

    // Class mobility moet zijn id + beschrijving + icon
    mobilityInRoom: {
        mobility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'mobility'
        },
        facscore: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fac'
        }
        // required: [true, 'Mobility in Room is required']
    },
    mobilityOnDepartment: {
        mobility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'mobility'
        },
        facscore: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fac'
        }
        // required: [true, 'Mobility on Department is required']
    },
    mobilityOffDepartment: {
        mobility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'mobility'
        },
        facscore: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fac'
        }
        // required: [true, 'Mobility off Department is required']
    },

    //informatie voor dietist
    // + exercises practitioners appointments

    dietAdvice: {
        breakfast: {
            type: String,
            required: [false]
        },
        lunch: {
            type: String,
            required: [false]
        },
        dinner: {
            type: String,
            required: [false]
        },
    },

    swallowAdvice: {
        consistency: {
            drinks: {
                type: String,
                required: [false]
            },
            regularmeal: {
                type: String,
                required: [false]
            },
            soup: {
                type: String,
                required: [false]
            },
            bread : {
                type: String,
                required: [false]
            },
            snacks : {
                type: String,
                required: [false]
            }
        },
        assistance: [{
            type: String,
            required: [false]
        }],
        movements: [{
            type: String,
            required: [false]
        }],
        tools: [{
            type: String,
            required: [false]
        }],
        hygiene: [{
            type: String,
            required: [false]
        }],
        medication: [{
            type: String,
            required: [false]
        }]
    },

    //info voor fysio
    // + exercises practitioners appointments mobility


    //class Transfer moet zijn id + beschrijving + plaatje
    transfer: {
        transfer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'transfer'
        },
        facscore: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fac'
        }
    },

    mainGoal: {
        type: String,
        required: false
    },

    subGoals :[{
        type : String,
        required : false
    }],

    adl : {
        showeringTop : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'adl'
        },
        showeringBottom : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'adl'
        },
        washingTop : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'adl'
        },
        washingBottom : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'adl'
        },
        dressingTop : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'adl'
        },
        dressingBottom : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'adl'
        },
        toilet : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'adl'
        },
        bed : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'adl'
        }
    }

    // cognitieve begeleiding??

    //info voor ergo


})


const Patient = mongoose.model('patient', PatientSchema);
module.exports = Patient;