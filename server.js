//require dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('./config/mongoConfig');

//import routes
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const resuscicationRoutes = require('./routes/resuscicationRoutes');
const mobilityRoutes = require('./routes/mobilityRoutes');
const authRoutes = require('./routes/authRoutes');
const facRoutes = require('./routes/facRoutes');
const transferRoutes = require('./routes/transferRoutes');

//define express app
const app = express();

//use dependencies
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

//connection with database
mongoose.connect(config.dburl_env, { useNewUrlParser: true, useUnifiedTopology: true });
var connection = mongoose.connection
    .once('open', () => console.log('Connected to MongoDB on ' + config.dburl_env))
    .on('error', (error) => {
        console.warn('Warning', error.toString());
    })

//add routes to app
userRoutes(app);
patientRoutes(app);
resuscicationRoutes(app);
mobilityRoutes(app);
authRoutes(app);
facRoutes(app);
transferRoutes(app);

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('Server is running on port ' + port))