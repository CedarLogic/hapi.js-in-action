var R = require('rethinkdb');

exports.register = function (server, options, next) {

    var setup = function (err, conn) {

        if (err) {
            throw err;
        }

        server.method({
            name: 'database.getRecent',
            method: function (callback) {

                R
                .table(options.dbTable)
                .orderBy(R.desc('timestamp'))
                .run(conn, function (err, cursor) {

                    if (err) {
                        throw err;
                    }

                    cursor.toArray(callback);
                });
            }
        });

        server.method({
            name: 'database.getFlight',
            method: function (code, callback) {

                R
                .table(options.dbTable)
                .filter({ code: code })
                .orderBy(R.desc('timestamp'))
                .run(conn, function (err, cursor) {

                    if (err) {
                        throw err;
                    }

                    cursor.toArray(callback);
                });
            }
        });

        server.method({
            name: 'database.addPing',
            method: function (payload, callback) {

                R
                .table(options.dbTable)
                .insert(payload)
                .run(conn, function (err) {

                    if (err) {
                        throw err;
                    }

                    callback();
                });
            }
        });
    };

    R.connect({ db: options.dbName }, setup);

    next();
};

exports.register.attributes = require('./package');
