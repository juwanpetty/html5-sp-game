import './scss/style.scss';
import mapImage from './img/overworld.png';

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

    // console.log(Math.atan2(mouseY, mouseX) / Math.PI * 180);
    player.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;
}

let gamepadAPI = {
    controller: {},
    connect: function(event) {
        gamepadAPI.controller = event.gamepad;
        console.log('Controller connected:', event.gamepad);
    },
    disconnect: function(event) {
        delete gamepadAPI.controller;
        console.log('Controller disconnected', event.gamepad);
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
        context.stroke();

        let gamepadX = gamepads.axes[0];
        let gamepadY = gamepads.axes[1];

        if (gamepadX < threshold && gamepadX > (-threshold)) {
            gamepadX = 0;
        }

        if (gamepadY < threshold && gamepadY > (-threshold)) {
            gamepadY = 0;
        }

        let aimAngle = Math.atan2(gamepadY, gamepadX) * (180 / Math.PI);

        context.font = '20px Arial';
        context.fillText(aimAngle, 10, 50);

        // axis controls
        player.x = player.x + (this.applyDeadZone(gamepads.axes[0], threshold) * player.speed);
        player.y = player.y + (this.applyDeadZone(gamepads.axes[1], threshold) * player.speed);

        context.fillText(
            'X:' + this.applyDeadZone(gamepads.axes[0], threshold) * player.speed,
            10, 
            75
        );
        
        context.fillText(
            'Y:' + this.applyDeadZone(gamepads.axes[1], threshold) * player.speed,
            10, 
            100
        );
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
}

update();