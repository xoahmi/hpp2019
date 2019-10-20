//Version: with set message timing: 12/3/2015

//Mako Topside
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var gamepad = require("gamepad");
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

// const TCU = '192.168.1.2';
// const TCUPORT = 1581;

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

// add io attribute to topside app object, create and assign socket.io
topside.io = require('socket.io')();

//create webpage handler with express
topside.listen(3000, function(){
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
    res.render('error', {
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

// //Joystick
// function devices() {
//   var dev = [];
//
//   for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
//     dev.push(gamepad.deviceAtIndex(i));
//   }
//
//   return dev;
// }
//
// function printDevices() {
//   devices().forEach(function(device) {
//     var str = [
//       "",
//       "  ID:          " + device.deviceID,
//       "  Vendor ID:   " + device.vendorID,
//       "  Product ID:  " + device.productID,
//       "  Description: " + device.description,
//       ""
//     ].join("\n");
//
//     console.log(str);
//   });
// }
//
//
//
// //Joystick variables
//     var joyValue0=42767;
//     var joyValue1=42767;
//     var joyValue2=42767;
//     var joyValue3=42767;
//     var joyValue4=42767;
//     var joyValue5=42767;
//     var thrusterLeft = 1500;
//     var thrusterRight = 1500;
//     var thrusterUp = 1500;
//     var thrusterLeftBack = 1500;
//     var thrusterRightBack = 1500;
//     var thrusterUp2 = 1500;
//     var videom = 2;
//     var videop=7;
//     var handleTurnToggle = 0;
//     var handleTurnDirection = 0;
//     var servo1Pos = 1500;
//     var fineAdjV = 10000;
//     var fineAdjH = 10000;
//     var ext = 0;
//
//    var inversion = 0;
//    var testmsg=0;
//    var ROVsafe = 0;
//    var depthHold = 0;
//    var redLED = 1;
//    var whiteLED = 1;
//    var xsense = 1;
//    var ysense = 1;
//    var zsense = 1;
//    var vsense = 1;
//    var singleSideThrust = 0;
//     function inBetween(a,b,c){
//      if(a<b){
//      return b;
//        }
//      else if(c<a){
//        return c;
//        }
//      else{
//        return a;
//        }
//     }
//
// gamepad.on("attach", function(id, state) {
// 		var thrustmasterProductID = 46727;
// 		var logitechProductID = 49685;
// 		findProdID();
//     countDevices();
//     	});
//
// gamepad.on("remove", function(id,state){
//   countDevices();
// });
//
// //id is an instance of a device. it changes everytime a device is attached
// //this function associates a product id (unchanging) with a device id (changing)
// function findProdID(){
// 	devices().forEach(function(device) {
// 		//associates id with product ID
// 		if (device.productID == 46727){
// 			thrustmasterID = device.deviceID;
// 		}else if (device.productID == 49685){
// 			logitechID = device.deviceID;
// 		}
// 	})
// }
//
// var defaultPacket = true;
//
// function countDevices(){
//   if (gamepad.numDevices() < 2){
//     console.log("Too few SDL-compatible gamepads are currently connected.");
//     printDevices();
//     defaultPacket = true;
//   }
//   else if (gamepad.numDevices() > 2) {
//     console.log("Too many SDL-compatible gamepads are currently connected.");
//     printDevices();
//     defaultPacket = true;
//   }
//   else if (gamepad.numDevices() == 2) {
//     console.log("The current SDL-compatible devices are connected:");
//     printDevices();
//     defaultPacket = false;
//   }
//   else {
//     console.log("Something is wrong. Check things out manually.");
//     printDevices();
//     defaultPacket = true;
//   }
// }
//
// // initialize, start polling gamepad events
// gamepad.init();
// setInterval(gamepad.processEvents, GPPing);
// setInterval(gamepad.detectDevices, 100);
//
// countDevices();
//
// /*
//     gamepad.on("up", function (deviceId, num) {
//       if (deviceId !== id) {
//         return;
//       }
//       //console.log("up", {num: num});
//     });
// */
// gamepad.on("down", function (id, num) {
//
//   if (id == logitechID){
// 		    switch( num) {
//           case 0:
//           if (WorkLight == 0)
//             WorkLight = 1;
//           else
//             WorkLight = 0;
//             break;
//         case 1:
//           if (inversion == true)
//              inversion = false;
//           else
//              inversion = true;
//             break;
//         case 2:
//           videom = 0;
//             break;
//         case 3:
//           if (PMC > 1)
//             PMC = PMC - 1;
// 			      break;
// 		    case 4:
//           videom = 1;
//       			break;
// 		    case 5:
//           if (PMC < 9)
//             PMC = PMC + 1;
// 		       break;
// 	      case 6:
//             videom = 2;
// 			      break;
// 		    case 7:
//             videom = 3;
// 			      break;
// 		    case 8:
//            videom = 4;
//            break;
// 		    case 9:
//           videom = 5;
// 			     break;
// 		    case 10:
//           videom = 6;
// 			     break;
// 		    case 11:
//           videom = 7;
// 			     break;
// 		    case 12:
// 			     break;
// 		    default:
// 			console.log("down", {num: num});
// 		}
//   }
// 	if (id == thrustmasterID) {
// 		switch( num) {
// 		case 0:
//       if (ElectroMag == 0)
//         ElectroMag = 1;
//       else
//         ElectroMag = 0;
//         break;
// 		case 1:
//       if (OptoCoupler == 0)
//         OptoCoupler = 1;
//       else
//         OptoCoupler = 0;
//   			break;
// 		case 2:
//       if (Buzzer == 0)
//         Buzzer = 1;
//       else
//         Buzzer = 0;
//   			break;
// 		case 3:
// 			break;
// 		case 4:
// 			break;
// 		case 5:
// 			break;
// 		case 6:
//       if (xsense < 5){
//         xsense = xsense + 1;
//       }
//       break;
// 		case 7:
//       if (ysense < 5){
//         ysense = ysense + 1;
//       }
// 			break;
// 		case 8:
//       if (xsense > 0){
//         xsense = xsense - 1;
//       }
// 			break;
// 		case 9:
//       if (ysense > 0){
//         ysense = ysense - 1;
//       }
// 			break;
//       case 10:
//         if (zsense < 5){
//           zsense = zsense + 1;
//         }
//         break;
//   		case 11:
//         if (vsense < 5){
//           vsense = vsense + 1;
//         }
//   			break;
//   		case 12:
//         if (zsense > 0){
//           zsense = zsense - 1;
//         }
//   			break;
//   		case 13:
//         if (vsense > 0){
//           vsense = vsense - 1;
//         }
//   			break;
// 		default:
// 			console.log("down", {num: num});
// 		}
// 	}
// });
//
// gamepad.on("move", function (id, axis, value) {
//      /* if (deviceId !== id) {
//         return;
//       }*/
//  //     console.log("move", {axis: axis, value: value});
//
//     //changing values from -32767 to 32767
//     // range 10000-75535
//     var editValue = (Math.round(value * 32767)) + 42768 ;
//     if((36767 < editValue)&&( editValue < 48767) ) {   //deadzone is +/- 10000
//       editValue = 42767;
//     }
//
//
// 	if (id == logitechID) { //read logitech axes
// 		switch( axis ) {
// 		case 0:
// 		  joyValue0 = editValue;  //LEFT IS NEGATIVE, RIGHT IS POSITIVE
// 			break;
// 		case 1:
// 			joyValue1 = editValue; //MAKES FORWARD POSITIVE
// 			break;
// 		case 2:
// 			joyValue2 = editValue; //LEFT IS NEGATIVE, RIGHT IS POSITIVE
// 			break;
// 		case 3:
// 			MotorA = Math.round(value) + 1;
// 			break;
// 		case 4:
// 			MotorC = Math.round(value) + 1; //un-used
// 			break;
// 		case 5:
//             MotorD = Math.round(value) + 1;
// 			break;
// 		default:
// 			console.log("down", {axis: axis});
// 		}
// 	}
// 	if (id == thrustmasterID) {
// 	  	switch( axis ) {
// 		case 0:
//       fineAdjH = editValue;
// 			break;
// 		case 1:
// 			fineAdjV = editValue; //makes up positive
// 			break;
// 		case 2:
// 			joyValue3 = editValue; //MAKES UP POSITIVE
// 			break;
// 		case 5:
// 			paddleValue = editValue; //makes right positive
// 			break;
// 		case 7:
//       MotorB = Math.round(value) + 1;
// 			break;
// 		case 8:
//     if (value = -1 && Solenoid1 > 0)
//       Solenoid1 = Solenoid1 - 1;
//     else if (value = 1 && Solenoid1 < 2)
//       Solenoid1 = Solenoid1 + 1;
// 			break;
// 		case 9:
// 			break;
// 		default:
// 		console.log("down", {axis: axis});
// 		}
// 	}
//
//
//   });

//End joystick


//-------------downstream UDP datagram message handlers---------------//
const server = dgram.createSocket('udp4');
const client = dgram.createSocket('udp4');

server.on('listening', function () {
  var address = server.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
  bottomMessage = message;
  //console.log(bottomMessage.toString());
  topside.io.emit('crateIDMessage', bottomMessage.toString());
});

//retry if server.bind fails
server.on('error', (err) => {
  console.log("Bind attempt #" + attempt + " failed.")
  attempt = attempt + 1;
  }
);

var connectionStatus = false;
var attempt = 1;

function rovServerConnect(){
  if(connectionStatus == false){
    if(attempt > 1){
      console.log("Retrying.");
    }
    server.bind(UDPPORT, HOST, () =>{
      connectionStatus = true;
      console.log("Bind attempt #" + attempt + " succeeded.");
    });
  }
}

setInterval(rovServerConnect, 500);

//set rate and send packets to ROV every ROVping ms
setInterval(sendROVMessage, ROVping);

function sendROVMessage(){
	// if(videom == 3 || videom == 4 || videom == 5 ){
	// 	inversion = 0;
	// 	}
	// else if(videom == 1 || videom == 2){
	// 	inversion = 1;
	// 	}
    //  //  toROVMessage = "01" + " " + "01" + " " + "003" + " " + thrusterLeft + " " + thrusterRight + " " + thrusterLeftBack + " " + thrusterRightBack + " " + thrusterUp + " " + thrusterUp2  + " " + redLED + " " + whiteLED + " " + '0' + " " + videom + " " + videop + " " + handleTurnToggle + " " + handleTurnDirection + " " + servo1Pos; //change hard coated '0' to depthHold
    //  if (defaultPacket == false){
    //    toROVMessage = "1" + " " + ROVsafe +  " " + joyValue0 +  " " + joyValue1 +  " " + joyValue2 +  " " + joyValue3 +  " " + inversion +  " " + fineAdjH + " " +  fineAdjV  + " " + xsense +  " " + ysense +  " " + zsense +  " " + vsense +  " " + videom + " " + PMC + " " + MotorA + " " + MotorB + " " + MotorC + " " + MotorD + " " + ElectroMag + " " + OptoCoupler + " " + Buzzer + " " + Solenoid1 +  " " + WorkLight;
    //  }
    //  else {
       toROVMessage = "1 0 42767 42767 42767 42767 0 42767 42767 1 1 1 1 0 2 0 0 0 0 0 0 0 0 0 0 0";
     //}
      client.send(toROVMessage, 0, toROVMessage.length, ROVPORT, ROV, (err) => {
        //client.close();
      });
      //console.log("Message" + toROVMessage);//to do: showing if inversion is true
}

//--------------TCU----------------------------------------------------//

/* Events from touch controller client
CONGD => sent when connection is established and running: connection good
P1/0 => power button on/off input (ONLY command to control ROV power because of verification system in GUI)
S1/0 => special button on/off input
B(1-6)1/0 => button (1-6) on/off input
INV => invalid command sent by server

Events to touch controller client
CON => sent when connection is established and running: connection made
PP1/0 => power button on/off output/set
SS1/0 => special button on/off output/set
BB(1-6)1/0 => button (1-6) on/off output/set
V__.__ => voltage
I__.__ => current
END => end of connection (Not working -> python GUI still hangs if connections ended)

Commands to TCU board:
P0 = ROV power OFF
P1 = ROV Power ON
S0 = main solenoid OFF
S1 = main solenoid ON
O0 = extra optocoupler OFF
O1 = extra optocoupler ON
N1 = npx routine 1
N2 = npx routine 2
N3 = npx routine 3

Data Received from TCU Board:
Example:
V12.09
I229.10
C33.75
H28.64
V = voltage  @ load
I = current in mA
C = degrees in celcius
H = humidity %
*/


  //------------Raspberry Pi (touchscreen) [TCP]-----------------------------//
    //npm install net
  //     var tcuRpi = net.createServer(function(socket) {
  //
  //     socket.setTimeout(2147483647); //number of milliseconds = 35 minutes (max timeout)
  //
  //     //Upon client connection
  //     console.log('TCP Connection to ', TCU,  ' established on port ', TCUPORT);
  //     socket.write('CON');
  //
  //     //When client disconnects from server
  //     socket.on('end', function(){
  //         socket.destroy();
  //         console.log('TCP connection lost...\n');
  //     });
  //
  //     //When data is received from client
  //     socket.on('data', function(data){
	// 	data = data.toString();
  //       console.log('Received from touch controller: ', data, '\n');
  //       //socket.write('Got it!\n');
  //
  //       if(data == "P0"){
	// 		DuePort.write("P0\n")
	// 	}
	// 	else if(data == "P1"){
	// 		DuePort.write("P1\n")
	// 	}
	// 	else if(data == "B10"){
	// 		DuePort.write("S0\n")
	// 	}
	// 	else if(data == "B11"){
	// 		DuePort.write("S1\n")
	// 	}
  //
  //     });
  //
  //     socket.on('error', function(error){
  //         console.log("TCP", error.toString())
  //     });
  //
  //     //When socket has been inactive for a long time = 35 minutes
  //     socket.on('timeout', function (timedOutSocket) {
  //         console.log('TCP Socket has timed out');
  //         timedOutSocket.write('TCP Socket timed out!');
  //         timedOutSocket.destroy();
  //     });
  //
  //     //Read human input from terminal (Send commands to touch screen)
  //     var stdin = process.openStdin();
  //     stdin.on('data', function(chunk) {
  //         if (!socket.destroyed){
  //             socket.write(chunk);
  //             console.log('Sent to touch controller: ' + chunk);}});
  //
  //     //Shutdown gracefully = end touch controller port **NOT WORKING**
  //     process.on( 'SIGTERM ', function() {
  //         console.log('Sent to touch controller: END');
  //         socket.write('END');
  //         socket.end();
  //         process.exit();
  //     });
  //
  //   });
  //
  //   //What port and IP to listen to
  //   //IP should be IP given with ifconfig on server system
  //
  //   tcuRpi.listen(TCUPORT, TCU);
  //
  //   function shutdown() {
  //       server.close(); // socket file is automatically removed here
  //       process.exit();
  //   }
  //
  //   process.on('SIGINT', shutdown);
  //
  //
  // //------------Arduino Due (TCU Board) [serial/USB]----------------//
  // //replace with appropriate port #
  // var SerialPort = serial.SerialPort;
  // var DuePort = new serial("/dev/ttyACM0");
  //
  // DuePort.on('open', Open);
  // DuePort.on('data', dat);
  //
  //
  //
  //
  // function Open() {
  //   console.log("TCU Board Port Open")
  // }
  //
  // function dat(data) {
  //   console.log(data.toString());
  //
  // }


//-------upstream--------------------------------------------------//
//socket.io connection callback
topside.io.on("connection", function(socket){
  console.log("client  connected");
  var clientConnected = 1;


//broadcast bottomMessage to all webpages.
//timer to send data every pagePing milliseconds
setInterval(sendPageData,pagePing);

//adds a variable called bottomMessage to the JSON object that is transmitted to webpages.
function sendPageData(){
var d = new Date();
topside.io.emit('SocketStream', { bottomMessage: bottomMessage + " " +  clientConnected + "" + d.getTime() });
topside.io.emit('bottomMessage', bottomMessage);
}

//receive safety message from webpage
  socket.on("SafetyMessage", function(msg){
  if (testmsg == 0)
     testmsg = 1;
  else
     testmsg = 0;
//  console.log("relay:" + testmsg);
});

//------Co-pilot Buttons-------------------------------------------------------------------//
//receive Test message from copilot webpage
  socket.on("TestMessage", function(msg){
 console.log(msg);
   if(msg == "OFF"){
    ROVsafe = 1;
   }
   else{
    ROVsafe= 0;
   }
});

//video
socket.on("videomMessage", function(msg){
console.log("Video" + msg);
if(msg == 1)
{
 videom = 1;
}
else if(msg == 2)
{
 videom = 2;
}
else if(msg == 3)
{
 videom = 3;
}
else if(msg == 4)
{
 videom = 4;
}
else if(msg == 5)
{
 videom = 5;
}
else if(msg == 6)
{
 videom = 6;
}
else if(msg == 7)
{
	videom = 7;
}
else if(msg == 8)
{
	videom = 8;
}
});
/*
socket.on("videopMessage", function(msg){
console.log("Video" + msg);
 if(msg == "7"){
  videop = 7;
 }
 if(msg == "8"){
  videop = 8;
 }
});
*/

//------------------------------------------------------------------------------
//Toggle Handle Turner
  socket.on("handleTurnToggleMessage", function(msg){
 console.log(msg);
   if(msg == "ON"){
    handleTurnToggle = 1;
   }else{
    handleTurnToggle = 0;
	 }
});


//handleTurnClockwise
  socket.on("handleTurnMessage", function(msg){
 console.log("Turning C");
   if(msg == "0"){
    //handleTurnDirection = 0;
   }
});

//handleTurnCounterClockwise
  socket.on("handleTurnMessage", function(msg){
 console.log("Turning CC");
   if(msg == "2"){
    //handleTurnDirection = 1;
   }
});



 //servoSlider1
 //  socket.on("slider1Message", function(msg){
  //   console.log(msg);
//     servo1Pos=msg;
//});

//thrusterProportion

socket.on("horizontalProportionMessage", function(msg){
  console.log(msg);
   ysense = msg;
   xsense = msg;
   zsense = msg;
});

socket.on("verticalProportionMessage", function(msg){
    console.log(msg);
    vsense = msg;
});

//two thrusters only  feature

    socket.on("backOnlyMessage", function(msg){
        console.log(msg);
        console.log("Back Only");
        if(msg == 'ON'){
        singleSideThrust = 1;
        }
        if(msg =='OFF'){
        singleSideThrust = 0;
        }
    });

    socket.on("frontOnlyMessage", function(msg){
        console.log(msg);
        console.log("Front Only");
        if(msg == 'ON'){
        singleSideThrust = 2;
        }
        if(msg == 'OFF'){
        singleSideThrust = 0;

        }
    });
});

module.exports = topside;
