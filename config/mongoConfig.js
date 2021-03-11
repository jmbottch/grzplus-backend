var env = {
    webPort: process.env.Port || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'ZorgPlusDB'
}

var dburl_env = "mongodb://localhost:27017/ZorgPlusDB";

module.exports = {
    env,
   //  dburl,
    dburl_env,
    'secret' : 'supersecret',
    'adminsecret' : 'lksdajg;asdyoqwejtlksjdgja'
};