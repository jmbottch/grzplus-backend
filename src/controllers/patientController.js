const Patient = require('../models/patient');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config/mongoConfig');
const { collection } = require('../models/user');


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

    getAll(req, res) {
        Patient.find()
            .populate('practitioners')
            .populate({ path: 'appointments', populate: { path: 'practitioner', model: 'user' } })
            .populate('resuscitation')
            .populate({ path: 'mobilityInRoom', populate: { path: 'mobility', model: 'mobility' } })
            .populate({ path: 'mobilityInRoom', populate: { path: 'facscore', model: 'fac' } })
            .populate({ path: 'mobilityOnDepartment', populate: { path: 'mobility', model: 'mobility' } })
            .populate({ path: 'mobilityOnDepartment', populate: { path: 'facscore', model: 'fac' } })
            .populate({ path: 'mobilityOffDepartment', populate: { path: 'mobility', model: 'mobility' } })
            .populate({ path: 'mobilityOffDepartment', populate: { path: 'facscore', model: 'fac' } })
            .populate({ path: 'transfer', populate: { path: 'transfer', model: 'transfer' } })
            .populate({ path: 'transfer', populate: { path: 'facscore', model: 'fac' } })
            .then((patients) => {
                res.status(200).send(patients)
            })
            .catch((err) => {
                res.status(401).send({ Error: err })
            })
    },

    getOne(req, res) {
        Patient.findById(req.params.id)
            .populate('practitioners')
            .populate({ path: 'appointments', populate: { path: 'practitioner', model: 'user' } })
            .populate('resuscitation')
            .populate({ path: 'mobilityInRoom', populate: { path: 'mobility', model: 'mobility' } })
            .populate({ path: 'mobilityInRoom', populate: { path: 'facscore', model: 'fac' } })
            .populate({ path: 'mobilityOnDepartment', populate: { path: 'mobility', model: 'mobility' } })
            .populate({ path: 'mobilityOnDepartment', populate: { path: 'facscore', model: 'fac' } })
            .populate({ path: 'mobilityOffDepartment', populate: { path: 'mobility', model: 'mobility' } })
            .populate({ path: 'mobilityOffDepartment', populate: { path: 'facscore', model: 'fac' } })
            .populate({ path: 'transfer', populate: { path: 'transfer', model: 'transfer' } })
            .populate({ path: 'transfer', populate: { path: 'facscore', model: 'fac' } })
            .populate('swallowAdvice')
            .then((patient) => {
                res.status(200).send(patient);
            })
            .catch((err) => {
                res.status(401).send({ Error: err })
            })
    },

    create(req, res) {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8)
        Patient.create({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword,
            dateOfBirth: req.body.dateOfBirth,
            roomNr: req.body.roomNr,
            dietAdvice: req.body.dietAdvice,
            swallowAdvice: req.body.swallowAdvice,
            practitioners: req.body.practitioners,
            comments: req.body.comments,
            exercises: req.body.exercises,
            goalOfTheWeek: req.body.goalOfTheWeek,
            appointments: req.body.appointments,
            dateOfDeparture: req.body.dateOfDeparture,
            resuscitation: req.body.resuscitation,
            mobilityInRoom: req.body.mobilityInRoom,
            mobilityOnDepartment: req.body.mobilityOnDepartment,
            mobilityOffDepartment: req.body.mobilityOffDepartment,
            transfer: req.body.transfer
        })
            .then((user) => {
                res.status(200).send({ Message: success })
            })
            .catch((err) => {
                if (err.name == 'MongoError' && err.code == 11000) {
                    res.status(401).send({ Error: taken })
                } else {
                    res.status(401).send(err)
                }
            })
    },

    addUser(req, res) {
        Patient.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $addToSet: {
                    "practitioners": req.body.practitioner
                }
            }
        )
            .then((patient) => {

                patient.save()
                res.status(200).send(patient)
            })
            .catch((err) => {
                res.status(400).send(err)
            })
    },

    addComment(req, res) {
        Patient.findByIdAndUpdate({ _id: req.params.id }, {
            $addToSet: {
                "comments": {
                    author: req.body.author,
                    content: req.body.content
                }
            }
        })
            .then((patient) => {
                patient.save()
                res.status(200).send(patient)
            })
            .catch((err) => {
                res.status(400).send(err)

            })
    },

    update(req, res) {
        Patient.findByIdAndUpdate({ _id: req.params.id }, {
            $addToSet : {
                "swallowAdvice.assistance" : req.body.assistance,
                "swallowAdvice.movements" : req.body.movements,
                "swallowAdvice.tools" : req.body.tools,
                "swallowAdvice.hygiene" : req.body.hygiene,
                "swallowAdvice.medication" : req.body.medication                                
            } 
        })
            .then((patient) => {
                if (patient == null) {
                    res.status(401).send({ Error: 'Patient is null' })
                } else {
                    let drinksToSet = req.body.consistency.drinks;
                    let regularmealToSet = req.body.consistency.regularmeal;
                    let soupToSet = req.body.consistency.soup;
                    let breadToSet = req.body.consistency.bread;
                    let snacksToSet = req.body.consistency.snacks;

                    let breakfastToSet = req.body.dietAdvice.breakfast;
                    let lunchToSet = req.body.dietAdvice.lunch;
                    let dinnerToSet = req.body.dietAdvice.dinner;

                    if (req.body.consistency.drinks === '' || req.body.consistency.drinks === null) drinksToSet = patient.swallowAdvice.consistency.drinks;
                    if (req.body.consistency.regularmeal === '' || req.body.consistency.regularmeal === null) regularmealToSet = patient.swallowAdvice.consistency.regularmeal;
                    if (req.body.consistency.soup === '' || req.body.consistency.soup === null) soupToSet = patient.swallowAdvice.consistency.soup;
                    if (req.body.consistency.bread === '' || req.body.consistency.bread === null) breadToSet = patient.swallowAdvice.consistency.bread;
                    if (req.body.consistency.snacks === '' || req.body.consistency.snacks === null) snacksToSet = patient.swallowAdvice.consistency.snacks;

                    if (req.body.dietAdvice.breakfast === '' || req.body.dietAdvice.breakfast === null) breakfastToSet = patient.dietAdvice.breakfast;
                    if (req.body.dietAdvice.lunch === '' || req.body.dietAdvice.lunch === null) lunchToSet = patient.dietAdvice.lunch;
                    if (req.body.dietAdvice.dinner === '' || req.body.dietAdvice.dinner === null) dinnerToSet = patient.dietAdvice.dinner;
                    
                    patient.set({
                        swallowAdvice: {
                            consistency: {
                                drinks: drinksToSet,
                                regularmeal: regularmealToSet,
                                soup: soupToSet,
                                bread: breadToSet,
                                snacks: snacksToSet
                            },                            
                            // assistance: req.body.assistance,
                            // movements: req.body.movements,
                            // tools: req.body.tools,
                            // hygiene: req.body.hygiene,
                            // medication: req.body.medication
                        },
                        dietAdvice: {
                            breakfast: breakfastToSet,
                            lunch: lunchToSet,
                            dinner: dinnerToSet
                        },
                    })

                    patient.save()
                        .then(() => res.status(200).send({ Message: 'Operation was successful' }))
                        .catch((err) => res.status(401).send({Error : err}))
                }
            })
    }
}
