// Application configuration
'use strict';

var config = module.exports;

// Server setting.
config.server = {
    HTTP_HOST:"localhost",
    port: 8081
}

// Database setting.
config.db = {
    DATABASE_HOST : "localhost",
    DATABASE_PORT : 5433,
    DATABASE_NAME : "postgres",
    DATABASE_USER : "postgres",
    DATABASE_PASSWORD : "wkrkdfur129",
    DATABASE_URL  : "postgres://postgres:wkrkdfur129@localhost:5433/postgres"
}

// Api connection setting.
config.cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    signed: true, // if you use the secret with cookieParser
}
config.cookie = {
    SESSION_COOKIE_NAME : "mycookie",
    SESSION_COOKIE_BOTNAME : "BotCookie",
    SESSION_COOKIE_BOTINSTSESSION : "BotInstsession"
}
// Bot setting.
config.bot = {
    fUrl: './cookies/botSessions.json'
}