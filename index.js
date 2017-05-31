'use strict';

const bluebird = require('bluebird');
const io = require('socket.io-client');
const SerialPort = require('serialport');

const host = process.env.host || '62.109.20.84';
const serialPort = process.env.comPort || 'COM3';
const socket = io.connect(`${host}`, { rejectUnauthorized: false });

let arduinoPort;
let isOpen = false;

const promiseListPorts = bluebird.promisify(SerialPort.list);

let topMostData;

promiseListPorts().then((ports) => {
    console.log('list of available ports:');
    ports.forEach(function(port) {
        console.log(port.comName);
        console.log(port.pnpId);
        console.log(port.manufacturer);
    });
    console.log('---');
}).catch((err) => {
    console.error(err);
});

configureArduinoChannel();
configureSocket();

function flushStateToArduino() {
    if (!isOpen) {
        console.warn('attempt to flush state to unprepared arduino connection');
        return
    }

    if (!topMostData) {
        console.warn('data is not defined to be flushed to the arduino');
        return
    }

    console.log('flush state ' + JSON.stringify(topMostData));
    const message = String(topMostData.totalCount || "0");
    arduinoPort.write(message, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('message written', message);
    });
}

function configureSocket() {
    socket.on('updateTopMostTicket', function (data) {
        console.log('socket - updateTopMostTicket ' + JSON.stringify(data));
        topMostData = data;
        flushStateToArduino();
    });

    socket.on('error', function (data) {
        console.error('error', data);
    });

    socket.on('connect', function(){
        console.log('connect');
    });

    socket.on('event', function(data){
        console.log('event: ' + data);
    });

    socket.on('disconnect', function(){
        console.log('disconnect');
    });

    socket.on('reconnecting', function(){
        console.log('reconnecting');
    });

    socket.on('reconnect_error', function(error){
        console.log('reconnect_error ' + JSON.stringify(error));
    });

    socket.on('reconnect_failed', function(){
        console.log('reconnect_failed');
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
        flushStateToArduino();
    });

    arduinoPort.on('error', function(err) {
        console.log('Error: ', err.message);
    });

    arduinoPort.on('data', function (data) {
        console.log('Data: ' + data);
    });
}