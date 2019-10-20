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

const HOST = '127.0.0.1';
const UDPPORT = 33333;
const SOCKPORT = 55555;

const TeddyAddr = 'https://www.mediteddy.space';
const ROVPORT = 8888;




//latest top and bottom side packet
var bearMessage = "";


//express additions
var hpp2019 = express();
hpp2019.set('views', path.join(__dirname, 'views'));
hpp2019.set('view engine', 'ejs');

// add io attribute to hpp2019 app object, create and assign socket.io
hpp2019.io = require('socket.io')();




//------------Arduino Due (TCU Board) [serial/USB]----------------//
//replace with appropriate port #
const bearPort = new serial("/dev/cu.usbmodem14101");
var SerialPort = serial.SerialPort;
const parser = bearPort.pipe(new Readline({ delimiter: '\r\n' }))

bearPort.on('open', Open);
parser.on('data', dat)



function Open() {
    console.log("TCU Board Port Open")
}

function dat(data) {
    console.log(data.toString());

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