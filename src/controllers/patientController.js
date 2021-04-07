const Patient = require('../models/patient');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config/mongoConfig')


const taken = "This Email is already taken.";
const noTokenProvided = 'There was no token provided.';
const invalidToken = 'The provided token was invalid.';
const noAdmin = 'This User is not an Administrator.';
const noAdminToken = "There was no admin token found, it appears you are not an administrator.";
const userNotFound = 'This User was not found.';
const passwordInvalid = 'Email or password is incorrect.'
const answerInValid = 'The answer you entered is incorrect.'
//Success Responses
const isAdmin = 'This User is an Administrator.';
const success = "The operation was successful.";

module.exports = {

    getAll(req,res) {
        Patient.find()
        .populate('practitioners')
        .populate({path: 'comments', populate:{ path: 'author', model: 'user'}})
        .populate({path: 'appointments', populate:{path: 'practitioner', model:'user'}})
        .populate('resuscitation')
        .populate('mobilityInRoom')
        .populate('mobilityOnDepartment')
        .populate('mobilityOffDepartment')
        .then((patients) => {
            res.status(200).send(patients)
        })
        .catch((err) => {
            res.status(401).send({Error: "No patients found"})
        })
    },

    getOne(req,res) {
        Patient.findById(req.params.id)
        .populate('practitioners')
        .populate({path: 'comments', populate:{ path: 'author', model: 'user'}})
        .populate({path: 'appointments', populate:{path: 'practitioner', model:'user'}})
        .populate('resuscitation')
        .populate('mobilityInRoom')
        .populate('mobilityOnDepartment')
        .populate('mobilityOffDepartment')
        .then((patient) => {
            res.status(200).send(patient);
        })
        .catch((err) => {
            res.status(401).send({Error: "No patients found"})
        })
    },

    create(req,res){
        var hashedPassword = bcrypt.hashSync(req.body.password, 8)
        Patient.create({
            email : req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword,
            dateOfBirth: req.body.dateOfBirth,
            roomNr : req.body.roomNr,
            dietAdvice : req.body.dietAdvice,
            swallowAdvice : req.body.swallowAdvice,
            practitioners : req.body.practitioners,
            comments : req.body.comments,
            exercises : req.body.exercises,
            goalOfTheWeek : req.body.goalOfTheWeek,
            appointments : req.body.appointments,
            dateOfDeparture : req.body.dateOfDeparture,
            resuscitation : req.body.resuscitation,
            mobilityInRoom : req.body.mobilityInRoom,
            mobilityOnDepartment : req.body.mobilityOnDepartment,
            mobilityOffDepartment : req.body.mobilityOffDepartment
        })
        .then((user) => {
            res.status(200).send({Message : success})
        })
        .catch((err) => {
            if(err.name == 'MongoError' && err.code == 11000) {
                res.status(401).send({Error : taken})
            } else {
                res.status(401).send(err)
            }
        })
    }
}