'use strict';

const io = require('socket.io-client');
const SerialPort = require('serialport');

const host = process.env.host || '62.109.20.84';
// const port = process.env.port || 80;

const serialPort = 'COM3';

var arduinoPort;
var isOpen = false;

var socket = io('http://62.109.20.84');

configureArduinoChannel();
configureSocket();

function configureSocket() {

    socket.on('updateTopMostTicket', function (data) {
        console.log('socket - updateTopMostTicket ' + JSON.stringify(data));

        var message = String(data && data.ticket && data.ticket.shortKey || "0");
        isOpen && arduinoPort.write(message, function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message written', message);
        });
        arduinoPort.flush();
    });

    socket.on('error', function (data) {
        console.log('error', data);
    });
}



function configureArduinoChannel() {
    arduinoPort = new SerialPort(serialPort, {
        parser: SerialPort.parsers.readline('\n'),
        baudRate: 9600 // this is synced to what was set for the Arduino Code
    });

    arduinoPort.on('open', function() {
        console.log('port is open');
        isOpen = true;
    });

    arduinoPort.on('error', function(err) {
        console.log('Error: ', err.message);
    });

    arduinoPort.on('data', function (data) {
        console.log('Data: ' + data);
    });
}