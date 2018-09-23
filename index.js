import './scss/style.scss';
import mapImage from './img/overworld.png';

import { controller } from './js/controller';
import { keyboard } from './js/keyboard';

import { Cameras } from './js/cameras';
import { Maps } from './js/Maps';
import { Characters } from './js/Characters';

let context = document.querySelector("canvas").getContext("2d");

// let canvasWidth = document.documentElement.clientWidth;
// let canvasHeight = document.documentElement.clientHeight;
let canvasWidth = 800;
let canvasHeight = 600;

// Camera
let camera = new Cameras(200, 200, 800, 600);

// Map
let overworld = new Maps(mapImage, 40, 36, 16, 20, 20, 64);
console.log(overworld.image.src.complete);
overworld.addLayer([
    0,0,0,0,0,0,0,200,201,201,201,201,201,201,201,201,201,201,202,0,
    0,0,0,1174,1175,1176,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,1214,1215,1216,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,1254,1255,1256,0,0,0,242,243,243,243,243,243,243,244,0,0,0,
    0,0,0,1160,1161,1162,0,0,0,282,283,283,283,283,283,283,284,0,0,0,
    0,0,0,1200,1201,1202,0,0,0,282,124,283,283,283,125,283,284,0,0,0,
    0,0,0,1200,1360,1202,0,0,0,282,283,283,283,362,363,283,284,0,0,0,
    0,0,0,1200,1201,1202,0,0,0,282,283,283,283,402,403,283,284,0,0,0,
    1161,1161,1161,1161,1201,1202,1174,1175,1176,282,283,283,124,283,283,283,284,0,0,0,
    1201,1201,1360,1201,1201,1202,1214,1215,1216,282,283,362,323,323,323,323,324,0,0,0,
    1241,1241,1241,1241,1241,1242,1254,1255,1256,322,323,324,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,1174,1175,1176,0,0,0,242,243,243,244,0,
    0,0,0,0,0,0,0,0,0,1214,1215,1216,0,0,0,282,362,363,284,0,
    0,0,1174,1175,1176,0,0,0,0,1254,1255,1256,0,0,0,282,402,403,284,0,
    0,0,1214,1215,1216,0,0,0,0,0,0,0,0,0,365,322,323,323,324,0,
    0,0,1254,1255,1256,0,0,0,367,368,364,365,365,365,405,365,365,365,365,366,
    0,0,0,0,0,0,0,0,367,368,404,405,405,405,405,405,405,405,405,406,
    0,0,0,0,0,0,0,0,407,408,444,445,445,445,445,445,445,445,445,446,
    0,0,0,0,0,0,0,0,0,0,484,484,524,525,526,484,484,524,525,526
]);

// Character
let player = new Characters('Player 1');


// Movement Controls
document.onkeydown = event => {
    if(event.keyCode === 68)        //d
        player.pressingRight = true;
    else if(event.keyCode === 83)   //s
        player.pressingDown = true;
    else if(event.keyCode === 65) //a
        player.pressingLeft = true;
    else if(event.keyCode === 87) // w
        player.pressingUp = true;
}

document.onkeyup = event => {
    if(event.keyCode === 68)        //d
        player.pressingRight = false;
    else if(event.keyCode === 83)   //s
        player.pressingDown = false;
    else if(event.keyCode === 65) //a
        player.pressingLeft = false;
    else if(event.keyCode === 87) // w
        player.pressingUp = false;
} 

document.onmousemove = event => {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    mouseX -= player.x;
    mouseY -= player.y;

    console.log(Math.atan2(mouseY, mouseX) * (180 / Math.PI));
    player.aimAngle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

    context.fillText('Aim Angle: ' + (Math.atan2(mouseY, mouseX) * (180 / Math.PI)), 10, 50);
}

let gamepadAPI = {
    controller: {},
    connect: function(event) {
        gamepadAPI.controller = event.gamepad;
    },
    disconnect: function(event) {
        delete gamepadAPI.controller;
    },
    update: function() {
        let gamepads = navigator.webkitGetGamePads ? navigator.webkitGetGamePads() : navigator.getGamepads()[0];
        const threshold = 0.09;
        
        if (!gamepads) {
            return;
        }

        context.beginPath();
        context.moveTo(
            Math.round(player.x - camera.x + canvasWidth / 2 - camera.width / 2), 
            Math.round(player.y - camera.y + canvasHeight / 2 - camera.height / 2)
        );
        context.lineTo(
            ((Math.round(player.x - camera.x + canvasWidth / 2 - camera.width / 2)) + (gamepads.axes[0]) * 128), 
            ((Math.round(player.y - camera.y + canvasHeight / 2 - camera.height / 2)) + (gamepads.axes[1]) * 128)
        );
        context.strokeStyle = '#00ff00';
        context.stroke();

        let gamepadLeftX = gamepads.axes[0];
        let gamepadLeftY = gamepads.axes[1];

        this.thresholdBounds(gamepadLeftX, threshold);
        this.thresholdBounds(gamepadLeftY, threshold);
        
        let aimAngleLeft = Math.atan2(gamepadLeftY, gamepadLeftX) * (180 / Math.PI);

        context.font = '20px Arial';
        context.fillText('Aim Angle Left: ' + aimAngleLeft, 10, 50);

        let gamepadRightX = gamepads.axes[2];
        let gamepadRightY = gamepads.axes[5];

        this.thresholdBounds(gamepadRightX, threshold);
        this.thresholdBounds(gamepadRightY, threshold);

        let aimAngleRight = Math.atan2(gamepadRightY, gamepadRightX) * (180 / Math.PI);

        context.fillText('Aim Angle Right: ' + aimAngleRight, 400, 50);

        // axis controls
        player.x = player.x + (this.applyDeadZone(gamepads.axes[0], threshold) * player.speed);
        player.y = player.y + (this.applyDeadZone(gamepads.axes[1], threshold) * player.speed);

        context.fillText(
            'X1: ' + this.applyDeadZone(gamepads.axes[0], threshold) * player.speed,
            10, 
            75
        );
        
        context.fillText(
            'Y1: ' + this.applyDeadZone(gamepads.axes[1], threshold) * player.speed,
            10, 
            100
        );

        context.fillText(
            'X2: ' + this.applyDeadZone(gamepads.axes[2], threshold) * player.speed,
            400, 
            75
        );
        
        context.fillText(
            'Y2: ' + this.applyDeadZone(gamepads.axes[5], threshold) * player.speed,
            400, 
            100
        );

        context.beginPath();
        context.moveTo(
            Math.round(player.x - camera.x + canvasWidth / 2 - camera.width / 2), 
            Math.round(player.y - camera.y + canvasHeight / 2 - camera.height / 2)
        );
        context.lineTo(
            ((Math.round(player.x - camera.x + canvasWidth / 2 - camera.width / 2)) + (gamepads.axes[2]) * 128), 
            ((Math.round(player.y - camera.y + canvasHeight / 2 - camera.height / 2)) + (gamepads.axes[5]) * 128)
        );
        context.strokeStyle = '#ff0000';
        context.stroke();
    },
    buttonPressed: function(button) {
        if (typeof(button) == "object") {
            return button.pressed;
        }

        return button == 1.0;
    },
    applyDeadZone: function(number, threshold) {
        let percentage = (Math.abs(number) - threshold) / (1 - threshold);

        if (percentage < 0) {
            percentage = 0;
        }

        return percentage * (number > 0 ? 1 : -1);
    },
    thresholdBounds: function(axes, threshold) {
        if (axes < threshold && axes > (-threshold)) {
            axes = 0;
        }
    },
    buttons: [],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: []
};

// connect and disconnect controller events
window.addEventListener("gamepadconnected", gamepadAPI.connect);
window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);

const update = () => {
    window.requestAnimationFrame(update);

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Get width and height on every frame 
//     context.canvas.width = document.documentElement.clientWidth;
//     context.canvas.height = document.documentElement.clientHeight;

    context.imageSmoothingEnabled = false;

    // update objects
    overworld.update(0, camera);
    player.update(camera);
    camera.update(player.x, player.y);

    gamepadAPI.update();

    if (key.isDown('DOWN') || key.isDown('s')) {
        console.log('Keyboard key: S is pressed');
    }

    if (gamepad.isPressed('button[0]')) {
        console.log('button[0] is pressed');
    }

    if (gamepad.isMoved('axes[0]')) {
        console.log('axes[0] is moved');
    }
}

update();