/// <reference path="Scripts/typings/express/express.d.ts" />
/// <reference path="Scripts/typings/node/node.d.ts" />
console.log('Preparing modules...');

var express = require('express');

var path = require('path');

// Create the Express app.
var app = express();

console.log('Setting the port...');

// Define the port.
app.set('port', process.env.PORT || 8080);

console.log('Defining the view engine...');

// The view engine for this server.
app.set('view engine', 'jade');

// Definição da path das views para o view engine.
app.set('views', path.join(__dirname, 'views'));

console.log('Preparing the logger...');

// Logger
app.use(require('morgan')('dev'));

console.log('Setting the body parsers for Http Requests...');

// Body parser for express.
app.use(require('multer')());
app.use(require('body-parser')());

console.log('Mapping static routes...');

app.use(express.static(path.join(__dirname, 'public')));

// Set the error handler.
if ('development' == app.get('env')) {
    //     app.use(express.errorHandler());
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        next();
        res.send(500);
    });
}

// Configure routes.
require('./configs/routes').mapRoutes(app);

// Start the server.
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + '.');
});
//# sourceMappingURL=app.js.map
