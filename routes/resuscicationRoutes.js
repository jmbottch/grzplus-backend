const resuscitationController = require('../src/controllers/resuscitationController');

module.exports = (app) => {
    app.get('/api/resus', resuscitationController.getAll);
    
    app.get('/api/resus/:id', resuscitationController.getOne);

    app.post('/api/resus',  resuscitationController.create); //AuthController.validateAdmin,

}