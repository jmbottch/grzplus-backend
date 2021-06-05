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
            .populate({ path: 'adl', populate: {path: 'showeringTop', model:'adl'}})
            .populate({ path: 'adl', populate: {path: 'showeringBottom', model:'adl'}}) 
            .populate({ path: 'adl', populate: {path: 'washingTop', model:'adl'}}) 
            .populate({ path: 'adl', populate: {path: 'washingBottom', model:'adl'}}) 
            .populate({ path: 'adl', populate: {path: 'dressingTop', model:'adl'}}) 
            .populate({ path: 'adl', populate: {path: 'dressingBottom', model:'adl'}}) 
            .populate({ path: 'adl', populate: {path: 'toilet', model:'adl'}})  
            .populate({ path: 'adl', populate: {path: 'bed', model:'adl'}})   
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
            .populate({ path: 'adl', populate: {path: 'showeringTop', model:'adl'}})
            .populate({ path: 'adl', populate: {path: 'showeringBottom', model:'adl'}}) 
            .populate({ path: 'adl', populate: {path: 'washingTop', model:'adl'}}) 
            .populate({ path: 'adl', populate: {path: 'washingBottom', model:'adl'}}) 
            .populate({ path: 'adl', populate: {path: 'dressingTop', model:'adl'}}) 
            .populate({ path: 'adl', populate: {path: 'dressingBottom', model:'adl'}}) 
            .populate({ path: 'adl', populate: {path: 'toilet', model:'adl'}})  
            .populate({ path: 'adl', populate: {path: 'bed', model:'adl'}})       
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
            dietAdvice: req.body.dietAdvice,
            swallowAdvice: req.body.swallowAdvice,
            practitioners: req.body.practitioners,
            comments: req.body.comments,
            exercises: req.body.exercises,
            mainGoal: req.body.mainGoal,
            subGoals:req.body.subGoals,
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

    addAppointment(req,res) {
        Patient.findByIdAndUpdate({_id : req.params.id} , {
            $addToSet: {
                "appointments" : {
                    date : req.body.date,
                    description: req.body.description,
                    practitioner : req.body.practitioner
                }
            }
        })
        .then((patient) => {
            patient.save()
            res.status(200).send(patient)
        })
        .catch((err) => {
            res.status(401).send({Error : err})
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

    editMainGoal(req,res) {
        Patient.findByIdAndUpdate({_id : req.params.id})
        .then((patient) => {
            let mainGoalToSet = req.body.mainGoal
            if(req.body.mainGoal === null || req.body.mainGoal === '') mainGoalToSet = patient.mainGoal
            
            patient.set({
                mainGoal : mainGoalToSet
            })
            patient.save()
            .then((patient) => {
                res.status(200).send({Message : 'Operation was successful'})
            })
            .catch((err) => {
                res.status(401).send({Error : err})
            })
        })
        .catch((err) => {
            res.status(401).send({Error : err})
        })
    },
    editSubGoals(req,res) {
        Patient.findByIdAndUpdate({_id : req.params.id})
        .then((patient) => {
            let subgoalsToSet = req.body.subGoals
            if(req.body.mainGoal === null || req.body.mainGoal === []) subgoalsToSet = patient.subGoals
            
            patient.set({
                subGoals : subgoalsToSet
            })
            patient.save()
            .then((patient) => {
                res.status(200).send({Message : 'Operation was successful'})
            })
            .catch((err) => {
                res.status(401).send({Error : err})
            })
        })
        .catch((err) => {
            res.status(401).send({Error : err})
        })
    },
    editExercises(req,res) {
        Patient.findByIdAndUpdate({_id : req.params.id})
        .then((patient) => {
            let exercisesToSet = req.body.exercises
            if(req.body.exercises === null || req.body.exercises === '') exercisesToSet = patient.exercises
            
            patient.set({
                exercises : exercisesToSet
            })
            patient.save()
            .then((patient) => {
                res.status(200).send({Message : 'Operation was successful'})
            })
            .catch((err) => {
                res.status(401).send({Error : err})
            })
        })
        .catch((err) => {
            res.status(401).send({Error : err})
        })
    },

    editMobilityAndTransfer(req,res) {
        Patient.findByIdAndUpdate({_id: req.params.id})
        .then((patient) => {
            let transferToSet = req.body.transfer.transfer
            let transferFacToSet = req.body.transfer.facscore
            
            let mobilityInRoomToSet = req.body.mobilityInRoom.mobility
            let mobilityInRoomFacToSet = req.body.mobilityInRoom.facscore

            let mobilityOnDepartmentToSet = req.body.mobilityOnDepartment.mobility
            let mobilityOnDepartmentFacToSet = req.body.mobilityOnDepartment.facscore

            let mobilityOffDepartmentToSet = req.body.mobilityOffDepartment.mobility
            let mobilityOffDepartmentFacToSet = req.body.mobilityOffDepartment.facscore

            if(req.body.transfer.transfer === '' || req.body.transfer.transfer === null) transferToSet = patient.transfer.transfer
            if(req.body.transfer.facscore === '' || req.body.transfer.facscore === null) transferFacToSet = patient.transfer.facscore

            if(req.body.mobilityInRoom.mobility === '' || req.body.mobilityInRoom.mobility === null) mobilityInRoomToSet = patient.mobilityInRoom.mobility
            if(req.body.mobilityInRoom.facscore === '' || req.body.mobilityInRoom.facscore === null) mobilityInRoomFacToSet = patient.mobilityInRoom.facscore

            if(req.body.mobilityOnDepartment.mobility === '' || req.body.mobilityOnDepartment.mobility === null) mobilityOnDepartmentToSet = patient.mobilityOnDepartment.mobility
            if(req.body.mobilityOnDepartment.facscore === '' || req.body.mobilityOnDepartment.facscore === null) mobilityOnDepartmentFacToSet = patient.mobilityOnDepartment.facscore

            if(req.body.mobilityOffDepartment.mobility === '' || req.body.mobilityOffDepartment.mobility === null) mobilityOffDepartmentToSet = patient.mobilityOffDepartment.mobility
            if(req.body.mobilityOffDepartment.facscore === '' || req.body.mobilityOffDepartment.facscore === null) mobilityOffDepartmentFacToSet = patient.mobilityOffDepartment.facscore

            patient.set({
                transfer: {
                    transfer : transferToSet,
                    facscore : transferFacToSet
                },
                mobilityInRoom: {
                    mobility : mobilityInRoomToSet,
                    facscore : mobilityInRoomFacToSet
                },
                mobilityOnDepartment: {
                    mobility : mobilityOnDepartmentToSet,
                    facscore : mobilityOnDepartmentFacToSet
                },
                mobilityOffDepartment: {
                    mobility : mobilityOffDepartmentToSet,
                    facscore : mobilityOffDepartmentFacToSet
                },
            })
            console.log(req.body)
            patient.save()
            .then((patient) => {
                res.status(200).send({Message : "operation successful"})
            })
            .catch((err) => {
                res.status(401).send({Error : err})
            })
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

    editADL(req,res) {
        Patient.findByIdAndUpdate(req.params.id)
        .then((patient) => {
            let showeringTopToSet = req.body.showeringTop;
            let showeringBottomToSet = req.body.showeringBottom;
            let washingTopToSet = req.body.washingTop;
            let washingBottomToSet = req.body.washingBottom;

            let dressingTopToSet = req.body.dressingTop;
            let dressingBottomToSet = req.body.dressingBottom;
            let toiletToSet = req.body.toilet;
            let bedToSet = req.body.bed;

            if(req.body.showeringTop === '' || req.body.showeringTop === null) showeringTopToSet = patient.adl.showeringTop
            if(req.body.showeringBottom === '' || req.body.showeringBottom === null) showeringBottomToSet = patient.adl.showeringBottom
            if(req.body.washingTop === '' || req.body.washingTop === null) washingTopToSet = patient.adl.washingTop
            if(req.body.washingBottom === '' || req.body.washingBottom === null) washingBottomToSet = patient.adl.washingBottom

            if(req.body.dressingTop === '' || req.body.dressingTop === null) dressingTopToSet = patient.adl.dressingTop
            if(req.body.dressingBottom === '' || req.body.dressingBottom === null) dressingBottomToSet = patient.adl.dressingBottom
            if(req.body.toilet === '' || req.body.toilet === null) toiletToSet = patient.adl.toilet
            if(req.body.bed === '' || req.body.bed === null) bedToSet = patient.adl.bed

            patient.set({
                adl : {
                    showeringTop : showeringTopToSet,
                    showeringBottom : showeringBottomToSet,
                    washingTop : washingTopToSet,
                    washingBottom : washingBottomToSet,
                    dressingTop : dressingTopToSet,
                    dressingBottom : dressingBottomToSet,
                    toilet : toiletToSet,
                    bed : bedToSet
                }
            })
            patient.save()
            .then(() => {
                res.status(200).send({Message : "Operation was successfull"})
            })
            .catch((err) => {
                res.status(401).send({Error : err})
            })
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
                            }
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
