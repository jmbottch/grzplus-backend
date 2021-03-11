const User = require('../models/user');

module.exports = {

    getOne(req,res) {
        User.findById(req.params.id)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            res.status(401).send({Error: "No users found"})
        })
    }
}