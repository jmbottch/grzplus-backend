const transferController = require('../src/controllers/transferController');

module.exports = (app) => {
    app.get('/api/transfer', transferController.getAll);
    
    app.get('/api/transfer/:id', transferController.getOne);

    app.post('/api/transfer',  transferController.create); //AuthController.validateAdmin,

}