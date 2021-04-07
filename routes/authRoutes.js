const authController = require('../src/controllers/authController');

module.exports = (app) => {   

    app.post('/api/auth/patient',  authController.validatePatient); //AuthController.validateAdmin,

}