const facController = require('../src/controllers/facController');

module.exports = (app) => {
    app.get('/api/fac', facController.getAll);
    
    app.get('/api/fac/:id', facController.getOne);

    app.post('/api/fac',  facController.create); //AuthController.validateAdmin,

}