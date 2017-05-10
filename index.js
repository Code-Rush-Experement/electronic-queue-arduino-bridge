'use strict';

const app = require('http').createServer();
const io = require('socket.io')(app);
const SerialPort = require('serialport');

const host = process.env.host || 'localhost';
const port = process.env.port || 81;

const serialPort = 'COM19';

var arduinoPort;
var isOpen = false;


configureArduinoChannel();
configureSocket();


app.listen(port, host);




function configureSocket() {
    io.on('connection', function (socket) {
        socket.on('updateTopMostTicket', function (data) {
            var message = String(data && data.ticket && data.ticket.shortKey || "");
            message && isOpen && port.write(message, function(err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
                console.log('message written', message);
            });
            port.flush();
        });
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