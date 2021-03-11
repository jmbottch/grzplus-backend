const { validateAdmin } = require('../src/controllers/authController');
const AuthController = require('../src/controllers/authController');

module.exports = (app) => {
    app.post('/api/users',  AuthController.register); //AuthController.validateAdmin,

    app.post('/api/users/login', AuthController.login);
}