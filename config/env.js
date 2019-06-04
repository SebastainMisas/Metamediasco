// Application environment configration.
'use strict';

var env = module.exports;

// Server setting.
env.server = {
    port:8080
};

// Token secret key.
env.keys = {
    secret: '/jVdfUX+u/Kn3qPY4+ahjwQgyV5UhkM5cdh1i2xhozE=' // Not anymore...
};

// SMTP userconfigration
env.smtp = {
    service: "Gmail",
    auth: {
        user: 'yusef.amr0812@gmail.com',
        pass: 'rango941001top@@'
    }
}