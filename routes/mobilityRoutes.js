const mobilityController = require('../src/controllers/mobilityController');

module.exports = (app) => {
    app.get('/api/mobi', mobilityController.getAll);
    
    app.get('/api/mobi/:id', mobilityController.getOne);

    app.post('/api/mobi',  mobilityController.create); //AuthController.validateAdmin,

}