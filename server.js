//require dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('./config/mongoConfig');

//import routes
const userRoutes = require('./routes/userRoutes');

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

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('Server is running on port ' + port))