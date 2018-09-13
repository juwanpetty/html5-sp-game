import { Sprites } from './sprites';
import playerImage from '../img/rogueplayer.png';

let context = document.querySelector("canvas").getContext("2d");
let canvasWidth = 800;
let canvasHeight = 600;

export function Characters(name) {
    // Player Stats
    this.name = name;
    this.health = 100;
    this.speed = 4;

    this.image = new Sprites(playerImage, 10, 10, 32, 64);

    // Player State
    this.states = {
        idle: 0,
        wander: 1,
        alert: 2,
        attack: 3,
        death: 4
    }

    this.state = this.states.idle;
    this.spriteIndex = this.states.idle;
    
    // Player Position and Depth
    this.x = 64 * 3;
    this.y = 64 * 4;

    this.width = this.image.desiredSize;
    this.height = this.image.desiredSize;

    // Player Aiming
    this.aimAngle = 0;
    
    // Keyboard Controls
    this.pressingDown = false;
    this.pressingUp = false;
    this.pressingLeft = false;
    this.pressingRight = false;
}

Characters.prototype.update = function(camera) {
    this.updatePosition();
    this.draw(camera);
}

Characters.prototype.updatePosition = function() {

    if (this.pressingUp)
        this.y -= this.speed; 
            
    if (this.pressingRight)
        this.x += this.speed;

    if (this.pressingDown)
        this.y += this.speed; 

    if (this.pressingLeft)
        this.x -= this.speed;  
    
    // if (this.x < this.width / 2) this.x = this.width / 2;
    // if (this.x > canvasWidth - this.width / 2) this.x = canvasWidth - this.width / 2;
    // if (this.y < this.height / 2) this.y = this.height / 2;
    // if (this.y > canvasHeight - this.height / 2) this.y = canvasHeight - this.height / 2;
}   

Characters.prototype.draw = function(camera) {
    context.save();

    if (this.state === this.states.idle) {
        this.idle(camera);
    } else if (this.state === this.states.wander) {
        this.wander(camera);
    } else if (this.state === this.states.alert) {
        this.alert(camera);
    } else if (this.state === this.states.attack) {
        this.attack(camera);
    } else if (this.state === this.states.death) {
        this.death(camera);
    }

    context.beginPath();
    context.rect(
        Math.round(this.x - camera.x + canvasWidth / 2 - camera.width / 2 - this.width / 2), 
        Math.round(this.y - camera.y + canvasHeight / 2 - camera.height / 2 - this.width / 2), 
        this.width, 
        this.height
    );
    context.stroke();

    document.onmousemove = event => {
        let mouseX = event.clientX;
        let mouseY = event.clientY;
    
        mouseX -= Math.round(this.x - camera.x + canvasWidth / 2 - camera.width / 2 - this.width / 2);
        mouseY -= Math.round(this.y - camera.y + canvasHeight / 2 - camera.height / 2 - this.height / 2);
    
        // console.log(Math.atan2(mouseY, mouseX) / Math.PI * 180);
        this.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;
    }

    context.restore();
}

Characters.prototype.idle = function(camera) {
    this.spriteIndex = this.states.idle;

    this.image.play(
        Math.round(this.x - camera.x + canvasWidth / 2 - camera.width / 2 - this.width / 2), 
        Math.round(this.y - camera.y + canvasHeight / 2 - camera.height / 2 - this.width / 2), 
        [0, 1, 2, 3, 4, 5, 6, 7]
    );

    if (this.pressingRight || this.pressingLeft || this.pressingDown || this.pressingUp) {
        this.state = this.states.wander;
    }

    document.onmousedown = () => {
        if (this.health > 0) {
            this.state = this.states.attack;
            this.isAttacking = true;
        }
    }

    if (this.health === 0) {
        this.state = this.states.death;
    }
}

Characters.prototype.wander = function(camera) {
    let frames = [];

    if (this.pressingUp) {
        frames = [20, 21, 22, 23, 24, 25];
    } else if (this.pressingLeft) {
        frames = [80, 81, 82, 83, 84, 85];
    } 
    else {
        frames = [10, 11, 12, 13, 14, 15];
    }

    this.image.play(
        Math.round(this.x - camera.x + canvasWidth / 2 - camera.width / 2 - this.width / 2), 
        Math.round(this.y - camera.y + canvasHeight / 2 - camera.height / 2 - this.width / 2),
        frames
    );

    if (!this.pressingRight && !this.pressingLeft && !this.pressingDown && !this.pressingUp) {
        this.state = this.states.idle;
    }
}

Characters.prototype.alert = function(camera) {
    console.log('Alert...');

    this.spriteIndex = this.states.wander;
}

Characters.prototype.attack = function(camera) {
    this.spriteIndex = this.states.attack;
    let frames = [];

    if (this.aimAngle < 0) {
        this.aimAngle = 360 + this.aimAngle;
    }

    if (this.aimAngle >= 45 && this.aimAngle <= 135) { // down
        frames = [50, 51, 52, 53, 54, 55];

    } else if (this.aimAngle >= 135 && this.aimAngle <= 225) { // left
        frames = [90, 91, 92, 93, 94];

    } else if (this.aimAngle >= 225 && this.aimAngle <= 315) { // up
        frames = [40, 41, 42, 43, 44, 45]; 

    } else {
        frames = [30, 31, 32, 33, 34];
    }

    this.image.play(
        Math.round(this.x - camera.x + canvasWidth / 2 - camera.width / 2 - this.width / 2), 
        Math.round(this.y - camera.y + canvasHeight / 2 - camera.height / 2 - this.width / 2), 
        frames
    );

    document.onmouseup = () => {
        this.isAttacking = false;
    }
    
    if (!this.isAttacking) {
        this.state = this.states.idle;
    }
}

Characters.prototype.death = function(camera) {
    this.image.play(
        Math.round(this.x - camera.x + canvasWidth / 2 - camera.width / 2 - this.width / 2), 
        Math.round(this.y - camera.y + canvasHeight / 2 - camera.height / 2 - this.width / 2), 
        [70, 71, 72, 73, 74, 75],
        false
    );

    if (this.health > 0) {
        this.state = this.states.idle;
    }
}