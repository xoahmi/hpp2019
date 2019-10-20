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

const TeddyAddr = 'https://www.mediteddy.space';


//------------Webpage Handling ------

// view engine setup
const hpp2019 = express();

const routes = require('./routes/index');

//routing to index
hpp2019.set('views', path.join(__dirname, 'views'));
hpp2019.engine('html', require('ejs').renderFile);
hpp2019.set('view engine', 'html');

// hpp2019.set('views', path.join(__dirname, 'views'));
// hpp2019.set('view engine', 'ejs'); //html should be ejs

// add io attribute to hpp2019 app object, create and assign socket.io
hpp2019.io = require('socket.io')();


// setting up webpages on localhost:3000
hpp2019.listen(3000, function(){
    console.log('listening on *:3000');
});

//hpp2019.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//hpp2019.use(logger('dev'));

hpp2019.use(bodyParser.json());
hpp2019.use(bodyParser.urlencoded({ extended: false }));
hpp2019.use(cookieParser());
hpp2019.use(express.static(path.join(__dirname, '/public')));


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
        res.render('error.ejs', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user haha jk
hpp2019.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.ejs', {
        message: err.message,
        error: err //{} ... unless?
    });
});



// M A G I C Basic Temp classifier:
var classifier =
    [[[0, 1, 1, 3, 3, 3],
        [0, 1, 1, 3, 3, 3],
        [0, 1, 3, 5, 5, 5],
        [0, 1, 3, 5, 5, 5],
        [0, 1, 3, 5, 5, 5],
        [0, 1, 2, 2, 2, 2],
        [0, 1, 1, 4, 4, 4],
        [0, 1, 1, 6, 6, 6],
        [0, 1, 1, 4, 6, 6],
        [0, 1, 1, 1, 1, 6],
        [0, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1]],

        [[0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1]],

        [[0, 5, 5, 5, 5, 5],
            [0, 5, 5, 5, 5, 5],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 2, 2],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 4, 4, 4],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]],

        [[0, 5, 5, 5, 5, 5],
            [0, 5, 5, 5, 5, 5],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 2, 2, 2],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1]],

        [[0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1]],

        [[0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 5, 5, 5, 5],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 5, 5, 5, 5],
            [0, 0, 5, 5, 5, 5],
            [0, 0, 5, 5, 5, 5],
            [0, 0, 5, 5, 5, 5]],

        [[0, 0, 0, 3, 3, 3],
            [0, 0, 0, 3, 3, 3],
            [0, 0, 3, 5, 5, 5],
            [0, 0, 3, 5, 5, 5],
            [0, 0, 3, 5, 5, 5],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 4, 4, 4],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 4, 6, 6],
            [0, 0, 0, 0, 6, 6],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]],

        [[0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6],
            [0, 0, 0, 6, 6, 6]],

        [[0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 3, 6, 6, 6],
            [0, 0, 3, 6, 6, 6],
            [0, 0, 3, 6, 6, 6],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]]];










//------------Arduino Mega[serial/USB]----------------//
//replace with appropriate port #
const bearPort = new serial("/dev/cu.usbmodem14101");
var SerialPort = serial.SerialPort;
const parser = bearPort.pipe(new Readline({ delimiter: '\r\n' }))

var bearMessage = "00000000000000";

bearPort.on('open', Open);
parser.on('data', dat)



function Open() {
    console.log("Bear Connected!")
}

function dat(data) {
    if(pageState.length % 4 == 1) {
        bearMessage = data.toString()
        console.log(bearMessage);
    }
}



//-------upstream--------------------------------------------------//
//socket.io connection callback
var pageState = "";

var currType = 0;
var currLoc = 0;
var currInty = 0;



var points = 0;
var priority = 0;
hpp2019.io.on("connection", function(socket){
    console.log("client  connected");
    var clientConnected = 1;


//broadcast bearMessage to all webpages.
//timer to send data every pagePing milliseconds
//    setInterval(sendPageData,pagePing);

//adds a variable called bearMessage to the JSON object that is transmitted to webpages.
    function sendPageData(){
        var d = new Date();
        hpp2019.io.emit('SocketStream', { pageMsg: pageState + " " +  clientConnected + "" + d.getTime() });
        hpp2019.io.emit('pageState', pageState);
    }
    function sendPriority(){
        var d = new Date();
        hpp2019.io.emit('SocketStream', { sendPriority: priority + " " +  clientConnected + "" + d.getTime() });
        hpp2019.io.emit('priority', priority);
    }

//receive safety message from webpage
    socket.on("Pagemsg", function(msg){
        pageState = msg;
        console.log("message is:" + pageState);
        points = pageState.split(',');
        // var pointPri = [0,0,0,0,0,0];
        // for(i = 0; i < points.length; i++) {
        //     a = points[i][0];
        //     b = points[i][1].charCodeAt(0) - 97;
        //     c = points[i][2];
        //     if (a==0 || b==0 || c==0) {
        //         pointPri[i] = 0;
        //     }
        //     else {
        //         pointPri[i] = classifier[a,b,c];
        //     }
        // }
        // var priority = Math.max(pointPri)

    });



    socket.on("type", function(msg){

        if (pageState.length %4 ==0) {
            if (msg >= 0 && msg < 14) {
                currType = msg;
                pageState += "" + currType;
            } else {
                console.log("Type out of range")
            }
        }

    });

    socket.on("inty", function(msg){

        if( pageState.length % 4 == 2) {
            if (msg >= 0 && msg < 6) {
                currInty = msg;

                if (pageState.length == 22) {
                    pageState + currInty + ",";
                    // exit prog, or enter locked state

                } else {
                    pageState += "" + currInty + ",";


                    var tempData = pageState;
                    cleanData()
                    sendPageData();

                    pageState = tempData;
                    // go back to webpage for type
                }
            } else {
                console.log("Type out of range")
            }
        }


    });

    function cleanData(){
        if(!(pageState.length == 24)){
            pageState = pageState.substring(0,pageState.length - (pageState.length%4));
            console.log(pageState);
            pageState = pageState + "0a0,0a0,0a0,0a0,0a0,0a0".substring(pageState.length ,23)
        }
    }

    socket.on("conf", function(msg){
        if (msg == 1){

            cleanData();

            sendPageData()

            // PRIORITIZE TIME

            sendPriority();

            bearMessage = "00000000000000";
            pageState = "";
            setTimeout(function(){
                console.log('next patient');  //call notification about prioritization
            },1000);



        }


    });
});

// classify and prioritize






module.exports = hpp2019;