const adlController = require('../src/controllers/adlController');

module.exports = (app) => {
    app.get('/api/adl', adlController.getAll);
    
    app.get('/api/adl/:id', adlController.getOne);

    app.post('/api/adl',  adlController.create); //AuthController.validateAdmin,

}