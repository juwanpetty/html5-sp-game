import { Sprites } from './sprites';
import playerImage from '../img/player.png';

let context = document.querySelector("canvas").getContext("2d");
let canvasWidth = 800;
let canvasHeight = 600;

export function Characters(name) {
    // Player Stats
    this.name = name;
    this.health = 100;
    this.speed = 5;

    this.image = new Sprites(playerImage, 9, 9, 16, 48);

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
    // this.updatePosition();
    // this.draw(camera);
}

// Characters.prototype.updatePosition = function() {

//     if (this.pressingUp)
//         this.y -= this.speed; 
            
//     if (this.pressingRight)
//         this.x += this.speed;

//     if (this.pressingDown)
//         this.y += this.speed; 

//     if (this.pressingLeft)
//         this.x -= this.speed;  
    
//     // if (this.x < this.width / 2) this.x = this.width / 2;
//     // if (this.x > canvasWidth - this.width / 2) this.x = canvasWidth - this.width / 2;
//     // if (this.y < this.height / 2) this.y = this.height / 2;
//     // if (this.y > canvasHeight - this.height / 2) this.y = canvasHeight - this.height / 2;
// }   

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

    // context.beginPath();
    // context.rect(
    //     Math.round(this.x - camera.x + canvasWidth / 2 - camera.width / 2 - this.width / 2), 
    //     Math.round(this.y - camera.y + canvasHeight / 2 - camera.height / 2 - this.width / 2), 
    //     this.width, 
    //     this.height
    // );
    // context.stroke();

    // document.onmousemove = event => {
    //     let mouseX = event.clientX;
    //     let mouseY = event.clientY;
    
    //     mouseX -= Math.round(this.x - camera.x + canvasWidth / 2 - camera.width / 2 - this.width / 2);
    //     mouseY -= Math.round(this.y - camera.y + canvasHeight / 2 - camera.height / 2 - this.height / 2);
    
    //     // console.log(Math.atan2(mouseY, mouseX) / Math.PI * 180);
    //     this.aimAngle = Math.atan2(mouseY, mouseX) / (Math.PI * 180);
    // }

    context.restore();
}

Characters.prototype.facing = function(state, angle) {

    // character 8-direction angles
    const facing = {
        east:       (angle <= 22.5   || angle >= 337.5 ) ? true : false,
        northEast:  (angle <  337.5  && angle >  292.5 ) ? true : false,
        north:      (angle <= 292.5  && angle >= 247.5 ) ? true : false,
        northWest:  (angle <  247.5  && angle >  202.5 ) ? true : false,
        west:       (angle <= 202.5  && angle >= 157.5 ) ? true : false,
        southWest:  (angle <  157.5  && angle >  112.5 ) ? true : false,
        south:      (angle <= 112.5  && angle >= 67.5  ) ? true : false,
        southEast:  (angle <  67.5   && angle >  22.5  ) ? true : false,
    }

    switch(state) {
        case "idle": 
            this.idle(facing);
            break;
        case "wander": 
            this.wander(facing);
            break;
        default: 
            this.idle(facing);
    }
}

Characters.prototype.idle = function(facing) {
    let frames = [];

    if (facing.north) {
        frames = [1];
    } else if (facing.west) {
        frames = [2];
    } else if (facing.east) {
        frames = [0];
    } else if (facing.south) {
        frames = [3];
    } else if (facing.northWest) {
        frames = [6];
    } else if (facing.northEast) {
        frames = [7];
    } else if (facing.southWest) {
        frames = [5];
    } else if (facing.southEast) {
        frames = [4];
    } else {
        frames = [3];
    }

    this.image.play(
        Math.round(this.x - (this.x - canvasWidth / 2) + canvasWidth / 2 - (canvasWidth) / 2 - this.width / 2), 
        Math.round(this.y - (this.y - canvasHeight / 2) + canvasHeight / 2 - (canvasHeight) / 2 - this.width / 2), 
        frames
    );

    // if (this.pressingRight || this.pressingLeft || this.pressingDown || this.pressingUp) {
    //     this.state = this.states.wander;
    // }

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

Characters.prototype.wander = function(facing) {
    let frames = [];

    if (facing.north) {
        frames = [18, 19, 20, 21, 22];
    } else if (facing.west) {
        frames = [27, 28, 29, 30, 31];
    } else if (facing.east) {
        frames = [9, 10, 11, 12, 13];
    } else if (facing.south) {
        frames = [36, 37, 38, 39, 40];
    } else if (facing.northWest) {
        frames = [63, 64, 65, 66, 67];
    } else if (facing.northEast) {
        frames = [72, 73, 74, 75, 76];
    } else if (facing.southWest) {
        frames = [54, 55, 56, 57, 58];
    } else if (facing.southEast) {
        frames = [45, 46, 47, 48, 49];
    } else {
        frames = [36, 37, 38, 39, 40];
    }

    this.image.play(
        Math.round(this.x - (this.x - canvasWidth / 2) + canvasWidth / 2 - (canvasWidth) / 2 - this.width / 2), 
        Math.round(this.y - (this.y - canvasHeight / 2) + canvasHeight / 2 - (canvasHeight) / 2 - this.width / 2),
        frames
    );

    // if (!this.pressingRight && !this.pressingLeft && !this.pressingDown && !this.pressingUp) {
    //     this.state = this.states.idle;
    // }
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