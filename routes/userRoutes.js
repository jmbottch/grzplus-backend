const { validateAdmin } = require('../src/controllers/authController');
const AuthController = require('../src/controllers/authController');
const userController = require('../src/controllers/userController');

module.exports = (app) => {
    app.get('/api/users/:id', userController.getOne);

    app.post('/api/users',  AuthController.register); //AuthController.validateAdmin,

    app.post('/api/users/login', AuthController.login);
}