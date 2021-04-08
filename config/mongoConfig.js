var env = {
    webPort: process.env.Port || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'ZorgPlusDB'
}

var dburl_env = "mongodb://localhost:27017/ZorgPlusDB";
var dburl="mongodb+srv://admin-jeroen:SecretPassword@grzplus.yyahl.mongodb.net/GRZDB?retryWrites=true&w=majority";

module.exports = {
    env,
   //  dburl,
    dburl_env,
    dburl,
    'secret' : 'supersecret',
    'adminsecret' : 'lksdajg;asdyoqwejtlksjdgja',
    'patientsecret' : 'djhasdghasdgalsduapsldjg'
};