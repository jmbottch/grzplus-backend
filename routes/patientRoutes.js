const patientController = require('../src/controllers/patientController');

module.exports = (app) => {
    app.get('/api/patients', patientController.getAll);
    
    app.get('/api/patients/:id', patientController.getOne);

    app.post('/api/patients',  patientController.create); //AuthController.validateAdmin,

    app.put('/api/patients/:id/adduser', patientController.addUser)

    app.put('/api/patients/:id/addcomment', patientController.addComment)

}