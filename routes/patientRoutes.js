const patientController = require('../src/controllers/patientController');

module.exports = (app) => {
    app.get('/api/patients', patientController.getAll);
    app.get('/api/patients/:id', patientController.getOne);
    app.post('/api/patients',  patientController.create); //AuthController.validateAdmin,
    app.put('/api/patients/:id/', patientController.update)
    app.put('/api/patients/:id/adduser', patientController.addUser)
    app.put('/api/patients/:id/addcomment', patientController.addComment)
    app.put('/api/patients/:id/addappointment', patientController.addAppointment)
    app.put('/api/patients/:id/editMainGoal', patientController.editMainGoal)
    app.put('/api/patients/:id/editSubGoals', patientController.editSubGoals)
    app.put('/api/patients/:id/editExercises', patientController.editExercises)
    app.put('/api/patients/:id/editMobilityAndTransfer', patientController.editMobilityAndTransfer)
    
    





}