var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({port: 4000});

server.views({
    engines: {
        hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layout',
    layout: true,
    isCached: false,
    helpersPath: './views/helpers',
    partialsPath: './views/partials'
});

server.register([{
    register: require('dindin-api')
},
{
    register: require('yar'),
    options: {
        cookieOptions: {
            password: 'password',
            isSecure: false
        }
    }
}], function (err) {

    if (err) {
        throw err;
    }

    server.route(require('./routes'));

    server.start(function () {
        console.log('Started server at', server.info.uri);
    });
});