
const ADL = require('../models/adl');

module.exports = {

    getOne(req,res) {
        ADL.findById(req.params.id)
        .then((obj) => {
            res.status(200).send(obj);
        })
        .catch((err) => {
            res.status(401).send({Error: "No object found"})
        })
    },

    getAll(req,res) {
        ADL.find()
        .then((objects) => {
            res.status(200).send(objects);
        })
        .catch((err) => {
            res.status(401).send({Error: "No object found"})
        })
    },

    create(req,res){
        ADL.create({
            value : req.body.value,
            image : req.body.image
        })
        .then((obj) => {
            res.status(200).send({Message : "Operation was succesful"})
        })
        .catch((err) => {
            res.status(400).send({Error : err})
        })
    }
}