(function() {
    var app, express, sqlite, db, pub, socket, events = [], _;
    express = require('express'),
    sys = require('sys'),
    sqlite = require('sqlite'),
    _ = require('underscore'),
    db = new sqlite.Database();

    pub = __dirname + '/public';
    app = express.createServer(express.compiler({
        src: pub,
        enable: ['sass']
    }), express.static(pub), express.logger(), express.bodyParser(), express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.get('/', function(req, res) {
        return res.render('index.jade');
    });
    app.get('/events', function(req, res) {
        return res.send(events);
    });
    app.listen(process.env.PORT || 8000);

    socket = require('socket.io').listen(app);
    socket.on('connection', function(client) {
        db.open("location.db", function (error) {
            if (error) {
                console.log("Tonight. You.");
                throw error;
            }
            var sql = 'SELECT * FROM CellLocation ORDER BY Timestamp ASC LIMIT 50';
            db.prepare(sql, function (error, statement) {
                if (error) throw error;
                statement.fetchAll(function (error, rows) {
                    _.each(rows, function(row, i) {
                        var marker = {
                            title: "Time: " + row.Timestamp,
                            lat: row.Latitude,
                            lng: row.Longitude
                        };
                        socket.broadcast(marker);
                        events.push(marker);
                    });
                    statement.finalize(function (error) {
                        console.log("Done.");
                    });
                });
            });
        });
        client.on('message', function(message) {
            return socket.broadcast(message);
        });
        return client.on('disconnect', function() {
            return client.broadcast(JSON.stringify([['disconnect', client.sessionId]]));
        });
    });
})();
