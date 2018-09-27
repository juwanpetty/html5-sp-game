import './scss/style.scss';
import mapImage from './img/overworld.png';

import { controller } from './js/controller';
import { keyboard } from './js/keyboard';

import { Cameras } from './js/cameras';
import { Maps } from './js/Maps';
import { Characters } from './js/Characters';

let context = document.querySelector("canvas").getContext("2d");
let canvasWidth = 800;
let canvasHeight = 600;
context.font = '20px Arial';

// Camera
let camera = new Cameras(200, 200, 800, 600);

// Map
let overworld = new Maps(mapImage, 40, 36, 16, 20, 20, 64);
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

let aimAngleLeft = 0;
let aimAngleRight = 0;
let mouseAngle = 0;
let keyboardAngle = 0;

let gamepadAPI = {
    mouseAngle(event) {
        const x1 = Math.round(player.x - camera.x + canvasWidth / 2 - camera.width / 2);
        const y1 = Math.round(player.y - camera.y + canvasHeight / 2 - camera.height / 2);
        const x2 = (event.clientX);
        const y2 = (event.clientY);

        mouseAngle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

        if (mouseAngle < 0) {
            mouseAngle = Math.abs(mouseAngle + 360);
        }

        player.aimAngle = mouseAngle;
    },
    keyboardAngle() {
        const isMovingDown = (key.isDown('DOWN') || key.isDown('s'));
        const isMovingUp = (key.isDown('UP') || key.isDown('w'));
        const isMovingLeft = (key.isDown('LEFT') || key.isDown('a'));
        const isMovingRight = (key.isDown('RIGHT') || key.isDown('d'));

        let xAxis = 0;
        let yAxis = 0;

        if (isMovingLeft) {
            xAxis = -1;
        }

        if (isMovingRight) {
            xAxis = 1;
        }

        if (isMovingUp) {
            yAxis = -1;
        }

        if (isMovingDown) {
            yAxis = 1;
        }

        if (isMovingDown && isMovingUp) {
            yAxis = 0;
        }

        if (isMovingLeft && isMovingRight) {
            yAxis = 0;
        }

        keyboardAngle = Math.atan2(yAxis, xAxis) * (180 / Math.PI);

        if (keyboardAngle < 0) {
            keyboardAngle = Math.abs(keyboardAngle + 360);
        }

        player.aimAngle = keyboardAngle;
    },
    update: function() {
        const isMoving = gamepad.isMoved('axes[0]') || gamepad.isMoved('axes[1]');
        const isAttacking = gamepad.isPressed('button[5]');
        const isMovingDown = (key.isDown('DOWN') || key.isDown('s'));
        const isMovingUp = (key.isDown('UP') || key.isDown('w'));
        const isMovingLeft = (key.isDown('LEFT') || key.isDown('a'));
        const isMovingRight = (key.isDown('RIGHT') || key.isDown('d'));

        if (isMovingLeft || isMovingRight || isMovingUp || isMovingDown) {
            this.keyboardAngle();
        }

        window.onmousedown = event => {
            this.mouseAngle(event);
        }  

        window.onmousemove = event => {
            if (event.buttons > 0) {
                this.mouseAngle(event);
            }
        }   

        if (gamepad.isMoved('axes[1]') || gamepad.isMoved('axes[0]')) {
            aimAngleLeft = Math.atan2(gamepad.isMoved('axes[1]'), gamepad.isMoved('axes[0]')) * (180 / Math.PI);

            if (aimAngleLeft < 0) {
                aimAngleLeft = Math.abs(aimAngleLeft + 360);
            }

            player.aimAngle = aimAngleLeft;
        }

        if (gamepad.isMoved('axes[5]') || gamepad.isMoved('axes[2]')) {
            aimAngleRight = Math.atan2(gamepad.isMoved('axes[5]'), gamepad.isMoved('axes[2]')) * (180 / Math.PI);

            if (aimAngleRight < 0) {
                aimAngleRight = Math.abs(aimAngleRight + 360);
            }

            player.aimAngle = aimAngleRight;
        }
    
        if (isMoving && !isAttacking) {
            // axis controls
            player.x = player.x + (gamepad.isMoved('axes[0]')) * player.speed;
            player.y = player.y + (gamepad.isMoved('axes[1]')) * player.speed;
        }

        if (isMovingUp) {
            player.y -= player.speed;
        }

        if (isMovingDown) {
            player.y += player.speed;
        }

        if (isMovingLeft) {
            player.x -= player.speed;
        }

        if (isMovingRight) {
            player.x += player.speed;
        }
            
        if ((isMoving || (isMovingDown || isMovingUp || isMovingLeft || isMovingRight)) && !isAttacking) {
            player.facing('wander', player.aimAngle);
        } else {
            player.facing('idle', player.aimAngle);
        }
        
        context.beginPath();
            context.moveTo(
                Math.round(player.x - camera.x + canvasWidth / 2 - camera.width / 2), 
                Math.round(player.y - camera.y + canvasHeight / 2 - camera.height / 2)
            );
            context.lineTo(
                ((Math.round(player.x - camera.x + canvasWidth / 2 - camera.width / 2)) + (gamepad.isMoved('axes[0]')) * 128), 
                ((Math.round(player.y - camera.y + canvasHeight / 2 - camera.height / 2)) + (gamepad.isMoved('axes[1]')) * 128)
            );
        context.save();
        context.strokeStyle = '#00ff00';
        context.stroke();
        context.restore();
    
        context.beginPath();
            context.moveTo(
                Math.round(player.x - camera.x + canvasWidth / 2 - camera.width / 2), 
                Math.round(player.y - camera.y + canvasHeight / 2 - camera.height / 2)
            );
            context.lineTo(
                ((Math.round(player.x - camera.x + canvasWidth / 2 - camera.width / 2)) + (gamepad.isMoved('axes[2]')) * 128), 
                ((Math.round(player.y - camera.y + canvasHeight / 2 - camera.height / 2)) + (gamepad.isMoved('axes[5]')) * 128)
            );
        context.save();
        context.strokeStyle = '#ff0000';
        context.stroke();
        context.restore();
    }
};

const update = () => {
    window.requestAnimationFrame(update);

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.imageSmoothingEnabled = false;

    // update objects
    overworld.update(0, camera);
    player.update(camera);
    camera.update(player.x, player.y);

    gamepadAPI.update();
}

update();