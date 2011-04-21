(function() {
    var app, express, sqlite, db, pub, socket, events = [], _, rd;
    express = require('express'),
    sys = require('sys'),
    sqlite = require('sqlite'),
    _ = require('underscore'),
    rd = require('relative-date');
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
            var sql = 'SELECT * FROM CellLocation ORDER BY RANDOM() ASC LIMIT 50';
            db.prepare(sql, function (error, statement) {
                if (error) throw error;
                statement.fetchAll(function (error, rows) {
                    _.each(rows, function(row, i) {
                        var unix = row.Timestamp+(31*365.25*24*60*60);
                        var weekInSeconds = 7*24*60*60;
                        var time = Math.floor(unix/weekInSeconds)*weekInSeconds;
                        var date = new Date(time*1000);
                        var marker = {
                            rel: rd(date),
                            date: date.toString(),
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
