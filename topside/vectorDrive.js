var method = vectorDrive.prototype;

function vectorDrive() {
    this.vectorMin = 1900; //maximum value 
    this.vectorMax = 1100; //minimum value 

    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.v = 0; //vertical Value
	
    this.xDeadzone = 100;
    this.yDeadzone = 100;
    this.zDeadzone = 100;

    this.motor1 = 0;
    this.motor2 = 0;
    this.motor3 = 0;
    this.motor4 = 0;
    this.motor5 = 0;
    this.motor6 = 0;
}


method.vectorMath = function(xInput, yInput, zInput, vInput, inverted, xS, yS, zS, vS)
{
    var axis = [xInput, yInput, zInput, vInput];
    var bilinearRatio = 1.5;
    var bilinearThreshold = 1.0/bilinearRatio;
    
   for(i=0;i<axis.length;i++)    //for each axis value
    {
        if((bilinearThreshold * -32768) <= axis[i] && axis[i] <= (bilinearThreshold * 32767)) //if the stick is within the range
        {
            axis[i] = (axis[i] / bilinearRatio);
        }
        else if((bilinearThreshold * 32767) < axis[i] && axis[i] <= 32767)  //if the stick is in upper section of range
        {
            axis[i] = ((bilinearRatio * axis[i]) + ((bilinearRatio * -32767)+32767));
        }
        else if(-32768 <= axis[i] && axis[i] < (bilinearThreshold * -32768))    //if the stick is in the lower section of range
        {
            axis[i] = ((bilinearRatio * axis[i]) + ((bilinearRatio * 32768)-32768));
        }
    } 
 

    var xVal = axis[0] * -(xS); //translate left and right
    var yVal = axis[1] * -(yS); //move forward and back
    var zVal = axis[2] * -(zS); // rotation
    var vVal = axis[3] * -(vS); // verticals

    if(this.qAbs(xVal) < this.xDeadzone)
        xVal = 0;

    if(this.qAbs(yVal) < this.yDeadzone)
        yVal = 0;

    if(this.qAbs(zVal) < this.zDeadzone)
        zVal = 0;

    //Percent calculations
    var xPercent;
    var yPercent;
    var zPercent;

    if( xVal > 0)
        xVal = xVal - this.xDeadzone;
    else if(xVal < 0)
      xVal = xVal + this.xDeadzone;

    if( yVal > 0)
        yVal = yVal - this.yDeadzone;
    else if(yVal < 0)
        yVal = yVal + this.yDeadzone;

    if( zVal > 0)
        zVal = zVal - this.zDeadzone;
    else if(zVal < 0)
        zVal = zVal + this.zDeadzone;

//console.log("After step 3 vector math: " + xVal + " "+ yVal +  " " + zVal +  " " + vVal); 


    var xPercent = (100 / (32767 - this.xDeadzone)) * xVal;
    var yPercent = -(100 / (32767 - this.yDeadzone)) * yVal;
    var zPercent = (100 / (32767 - this.zDeadzone)) * zVal;

//console.log("After step 4 vector math: " + xVal + " "+ yVal +  " " + zVal +  " " + vVal); 


    var maxInput = this.maxDouble(this.qAbs(xPercent), this.qAbs(yPercent));
    maxInput = this.maxDouble(this.qAbs(maxInput), this.qAbs(zPercent));
 
    if(inverted ==true){
     //inversion motor calculations unverified
     var motor1 = -(xPercent) + yPercent - zPercent;
     var motor2 = +(xPercent) + yPercent + zPercent;
     var motor3 = -(xPercent) - yPercent + zPercent;
     var motor4 = +(xPercent) - yPercent - zPercent;

    }
    else{
     //normal Motor calculations
     var motor1 = +(xPercent) - yPercent + zPercent;
     var motor2 = -(xPercent) - yPercent - zPercent;
     var motor3 = +(xPercent) + yPercent - zPercent;
     var motor4 = -(xPercent) + yPercent + zPercent;
    } 

//console.log("After step 5 vector math: " + motor1 + " "+ motor2 +  " " + motor3 +  " " + motor4); 

    var maxMotor = this.maxDouble(this.qAbs(motor1), this.qAbs(motor2));
    maxMotor = this.maxDouble(this.qAbs(maxMotor), this.qAbs(motor3));
    maxMotor = this.maxDouble(this.qAbs(maxMotor), this.qAbs(motor4));

    if(maxMotor == 0)
       maxMotor = 1;

    //Normalize the values so that no motor outputs over 100% thrust
    motor1 = motor1 * (maxInput/maxMotor);
    motor2 = motor2 * (maxInput/maxMotor);
    motor3 = motor3 * (maxInput/maxMotor);
    motor4 = motor4 * (maxInput/maxMotor);

//console.log("After step 6 vector math: " + motor1 + " "+ motor2 +  " " + motor3 +  " " + motor4); 

    motor1 = motor1 * (32767/100);
    motor2 = motor2 * (32767/100);
    motor3 = motor3 * (32767/100);
    motor4 = motor4 * (32767/100);

    this.motor1 = Math.round(this.mapInt(motor1, 32767, -32768, this.vectorMin, this.vectorMax));
    this.motor2 = Math.round(this.mapInt(motor2, 32767, -32768, this.vectorMin, this.vectorMax));
    this.motor3 = Math.round(this.mapInt(motor3, 32767, -32768, this.vectorMin, this.vectorMax));
    this.motor4 = Math.round(this.mapInt(motor4, 32767, -32768, this.vectorMin, this.vectorMax));
    this.motor5 = Math.round(this.mapInt(vVal, 32767, -32768, this.vectorMin, this.vectorMax));
    this.motor6 = Math.round(this.mapInt(vVal, 32767, -32768, this.vectorMin, this.vectorMax));
//    console.log("T1:" + this.motor1 + " T2:" + this.motor2 + " T3:" + this.motor3 + " T4:" + this.motor4 + " T5:" + this.motor5 + " T6:" + this.motor6);
}

method.qAbs = function(a) {

    if (a < 0) {
        return -a;
    }
   else {
        return a;
    }
}

method.mapInt = function(input, inMin, inMax, outMin, outMax)
{
    var output = (input - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    return output;
}

method.minInt = function(a, b) {
    if(a > b) {
        return b;
    }
    else {
        return a;
    }
}

method.maxInt = function(a, b) {
    if(a > b) {
        return a;
    }
    else {
        return b;
    }
}

method.constrainInt = function(a, min, max) {
    if(min < a && a < max) {
        return a;
    }
    else if(a <= min && a < max) {
        return min;
    }
    else if(min < a && max <= a) {
        return max;
    }
}

method.maxDouble = function(a, b) {
    if(a > b) {
        return a;
    }
    else {
        return b;
    }
}

module.exports = vectorDrive;
