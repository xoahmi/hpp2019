//Mako hpp2019
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
//var logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const readline = require("readline");
const dgram = require('dgram');
const net = require('net');
const serial = require("serialport");
const Readline = require('@serialport/parser-readline')


//ports and files defined

const HOST = '127.0.0.1';
const UDPPORT = 33333;
const SOCKPORT = 55555;


//const ROVPORT = 8888;
const TeddyAddr = 'https://www.mediteddy.space';



//------------Webpage Handling ------

// view engine setup
const hpp2019 = express();

const routes = require('./routes/index');


hpp2019.set('views', path.join(__dirname, 'views'));
hpp2019.set('view engine', 'html'); //html should be ejs

// add io attribute to hpp2019 app object, create and assign socket.io
hpp2019.io = require('socket.io')();

// JHS Robotics icon as in /public folder

//hpp2019.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//hpp2019.use(logger('dev'));

hpp2019.use(bodyParser.json());
hpp2019.use(bodyParser.urlencoded({ extended: false }));
hpp2019.use(cookieParser());
hpp2019.use(express.static(path.join(__dirname, 'public')));

//assign two new variables to global and every time a page is requested
//update the view vars to latest values before giving contol to engine
global.Data1 = "undefined";
global.Data2 = "undefined";
//assign the values to corresponding variables for each view/page
hpp2019.use(function (req, res, next) {
    res.locals = {
        Data1: global.Data1,
        Data2: global.Data2,
    };
    next();
});

//routes for webpage
hpp2019.use('/', routes);

// catch 404 (page not found) and forward to error handler
hpp2019.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// other error handlers

// development error handler
// will print stacktrace
if (hpp2019.get('env') === 'development') {
    hpp2019.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
hpp2019.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



//------------Arduino Due (TCU Board) [serial/USB]----------------//
//replace with appropriate port #
const bearPort = new serial("/dev/cu.usbmodem14101");
var SerialPort = serial.SerialPort;
const parser = bearPort.pipe(new Readline({ delimiter: '\r\n' }))

bearPort.on('open', Open);
parser.on('data', dat)



function Open() {
    console.log("Bear Connected!")
}

function dat(data) {
    bearMessage = data.toString()
    console.log(bearMessage);

}



//-------upstream--------------------------------------------------//
//socket.io connection callback
hpp2019.io.on("connection", function(socket){
    console.log("client  connected");
    var clientConnected = 1;


//broadcast bearMessage to all webpages.
//timer to send data every pagePing milliseconds
    setInterval(sendPageData,pagePing);

//adds a variable called bearMessage to the JSON object that is transmitted to webpages.
    function sendPageData(){
        var d = new Date();
        hpp2019.io.emit('SocketStream', { bearMessage: bearMessage + " " +  clientConnected + "" + d.getTime() });
        hpp2019.io.emit('bearMessage', bearMessage);
    }

//receive safety message from webpage
    socket.on("SafetyMessage", function(msg){
        if (testmsg == 0)
            testmsg = 1;
        else
            testmsg = 0;
//  console.log("relay:" + testmsg);
    });
});
//




module.exports = hpp2019;