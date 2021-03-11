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

    register(req, res) {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8)
        User.create({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword,
            role: req.body.role
        })
            .then((user) => {
                res.status(200).send({ Message: success })
            })
            .catch((err) => {
                if (err.name == 'MongoError' && err.code == 11000) {
                    res.status(401).send({ Error: taken })
                } else {
                    res.status(401).send({ err });
                }
            })
    },
    login(req, res) {
        User.findOne({ email: req.body.email }).select('+password')
            .then((user) => {
                if (user == null) {
                    res.status(401).send({ Error: passwordInvalid })
                } else {
                    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                    console.log(bcrypt.hashSync(req.body.password, 8))
                    console.log(user.password)
                    console.log(passwordIsValid)
                    if (passwordIsValid == false) {
                        res.status(401).send({ Error: passwordInvalid })
                    } else {
                        if(user.role == "admin") {
                            var token = jwt.sign({id:user._id}, config.adminsecret, {
                                expiresIn: 3600
                            })
                            res.status(200).send({auth: true, token: token, userid: user.id})
                        } else {
                            var token = jwt.sign({id: user._id}, config.secret, {
                                expiresIn: 86400 
                            });
                            res.status(200).send({ auth: true, token: token, userid: user.id})
                        }
                    }
                }
                
            })
            .catch((err) => {
                res.status(401).send({ err })
            })       
    },

    validateToken(req, res, next) {
        if (!req.headers.authorization) {                               // if there is no auth header
            return res.status(401).send({ Error: noTokenProvided });    // give error response
        }
        let token = req.headers.authorization.split(' ')[1]             // split Bearer from token
        if (token === 'null' || token === null) {                       // if there is no token
            return res.status(401).send({ Error: noTokenProvided });    // give error response
        }
        jwt.verify(token, config.secret, function (err, decoded) {      // verify the token with the secret
            if (err) {                                                  // if it goes wrong        
                return res.status(401).send({ Error: invalidToken });   // give error response
            }
            if (decoded) next();                                        // else go on
        })
    },

    //Validate if User is Admin
    validateAdmin(req, res, next) {
        if (!req.headers.authorization) {                                                          // if there is no adminToken header
            return res.status(401).send({ Error: noAdminToken });       // give error response
        }
        let token = req.headers.authorization.split(' ')[1]                                        // split Bearer from token
        if (!token) {                                                                       // if there is no token
            return res.status(401).send({ Error: noAdminToken });       // give error response
        }
        jwt.verify(token, config.adminsecret, function (err, decoded) { // verify the token with the adminsecret
            if (err) {                                                  // if it goes wrong    
                return res.status(401).send({ Error: invalidToken });   // give error response
            }
            if (decoded) next();                                        // else go on
        })
    },

}