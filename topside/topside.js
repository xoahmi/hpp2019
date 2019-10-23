//Version: with set message timing: 12/3/2015

//Mako Topside
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var gamepad = require("gamepad");
var readline = require("readline");
const dgram = require('dgram');
var net = require('net');
var serial = require("serialport");

//Routing
var routes = require('./routes/index');
var cop = require('./routes/cop');
var ops = require('./routes/ops');
var tm = require('./routes/tm');

//Communication
//<<<<<<< HEAD:Mako/Top Side/topside/topside.js
const HOST = '127.0.0.1';
//=======
//const HOST = '10.0.7.100';
//>>>>>>> 39e5adb7d320c96890dbee758d9baa06857b3681:Mako/Top Side/topside/topside.js
const UDPPORT = 33333;
const SOCKPORT = 55555;

const ROV = '127.0.0.1';
const ROVPORT = 8888;

const GPPing = 24; //gamepad polling frequency in ms
const pagePing = 200; //winsock broadcast to webpages every ms
const ROVping = 100;  //udp send to ROV every ms

//latest top and bottom side packet
var toROVMessage = "";
var bottomMessage = "";

// view engine setup
var topside = express();
topside.set('views', path.join(__dirname, 'views'));
topside.set('view engine', 'ejs');

var server = require('http').Server(topside);
topside.io = require('socket.io')(server);

topside.io.on("connection", function(socket) {
    console.log("client  connected");
});

//create webpage handler with express
server.listen(3000, function(){
 console.log('listening on *:3000');
});


//var vd = require("./vectorDrive.js");
//var x = new vd();

//Declaring product ID variables for controller recognition
var thrustmasterID;
var logitechID;

//accessory variables
var SafetyMode = 0;
var PMC = 0;
var MotorA = 0;
var MotorB = 0;
var MotorC = 0;
var MotorD = 0;
var ElectroMag = 0;
var OptoCoupler = 0;
var Buzzer = 0;
var Solenoid1 = 0;
//var Solenoid2 = 0;
var WorkLight = 0;


// JHS Robotics icon as in /public folder
topside.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//topside.use(logger('dev'));
topside.use(bodyParser.json());
topside.use(bodyParser.urlencoded({ extended: false }));
topside.use(cookieParser());
topside.use(express.static(path.join(__dirname, 'public')));

//assign two new variables to global and every time a page is requested
//update the view vars to latest values before giving contol to engine
global.Data1 = "undefined";
global.Data2 = "undefined";
//assign the values to corresponding variables for each view/page
topside.use(function (req, res, next) {
    res.locals = {
        Data1: global.Data1,
        Data2: global.Data2,
    };
    next();
});

topside.use('/', routes);
topside.use('/cop', cop);
topside.use('/ops', ops);
topside.use('/tm', tm);

// catch 404 (page not found) and forward to error handler
topside.use(function(req, res, next) {
    //console.log(res);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// other error handlers

// development error handler
// will print stacktrace
if (topside.get('env') === 'development') {
    topside.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.ejs', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
topside.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// ---------------------Gamepadx

//-------------downstream UDP datagram message handlers---------------/

//--------------TCU----------------------------------------------------//


//------------Raspberry Pi (touchscreen) [TCP]-----------------------------//

//-------upstream--------------------------------------------------//
//socket.io connection callback
// topside.io.on("connection", function(socket){
//     console.log("client  connected");
//     var clientConnected = 1;
//
//
// //broadcast bottomMessage to all webpages.
// //timer to send data every pagePing milliseconds
//     setInterval(sendPageData,pagePing);
//
// //adds a variable called bottomMessage to the JSON object that is transmitted to webpages.
//     function sendPageData(){
//         var d = new Date();
//         topside.io.emit('SocketStream', { bottomMessage: bottomMessage + " " +  clientConnected + "" + d.getTime() });
//         topside.io.emit('bottomMessage', bottomMessage);
//     }
//
// //receive safety message from webpage
//     socket.on("SafetyMessage", function(msg){
//         if (testmsg == 0)
//             testmsg = 1;
//         else
//             testmsg = 0;
// //  console.log("relay:" + testmsg);
//     });
// });

module.exports = topside;
