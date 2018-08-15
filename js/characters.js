function Characters(name) {
    // Player Stats
    this.name = name;
    this.health = 100;
    this.speed = 2.5;

    this.image = new Sprites('img/rogueplayer.png', 8, 8, 32, 64);

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
    this.x = 0;
    this.y = 0;
    this.width = this.image.desiredSize;
    this.height = this.image.desiredSize;

    // Player Aiming
    this.aimAngle = 0;

    // Player Animation
    this.spriteAnimationCounter = 0;
    this.attackAnim = 0;
    this.isAttacking = false;
    
    // Keyboard Controls
    this.pressingDown = false;
    this.pressingUp = false;
    this.pressingLeft = false;
    this.pressingRight = false;
}

Characters.prototype.update = function(map) {
    this.updatePosition(map);
    this.draw();
    this.spriteAnimationCounter += 0.15;

    if (this.state === this.states.attack || (this.state === this.states.death && this.attackAnim <= 5)) {
        this.attackAnim += 0.15;
    } else if (this.state === this.states.death && this.attackAnim >= 5) {
        this.attackAnim = 5;
    } else {
        this.attackAnim = 0;
    }
}

Characters.prototype.updatePosition = function(map) {
    // if player side touches collision tile 
    // don't go in direction of collision tile
    let playerLeft = (this.x - this.width / 2);
    let playerRight = (this.x + this.width / 2);
    let playerTop = (this.y - this.height / 2);
    let playerBottom = (this.y + this.height / 2);

    const collisionPlayerTop = map.isSolidTileAtXY(player.x, playerTop);
    const collisionPlayerRight = map.isSolidTileAtXY(playerRight, player.y);
    const collisionPlayerBottom = map.isSolidTileAtXY(player.x, playerBottom);
    const collisionPlayerLeft = map.isSolidTileAtXY(playerLeft, player.y);

    if (this.health !== 0) {
        if (collisionPlayerTop) {
            // this.y += this.speed; 
        } else {
            if (this.pressingUp) {
                this.y -= this.speed; 
            }
        }

        if (collisionPlayerRight) {
            // this.x -= this.speed;
        } else {
            if (this.pressingRight) {
                this.x += this.speed;
            }
        }

        if (collisionPlayerBottom) {
            // this.y -= this.speed;
        } else {
            if (this.pressingDown) {
                this.y += this.speed;  
            }
        }

        if (collisionPlayerLeft) {
            // this.x += this.speed;
        } else {
            if (this.pressingLeft) {
                this.x -= this.speed;  
            }
        }
    }
    
    if (this.x < this.width / 2) this.x = this.width / 2;
    if (this.x > canvasWidth - this.width / 2) this.x = canvasWidth - this.width / 2;
    if (this.y < this.height / 2) this.y = this.height / 2;
    if (this.y > canvasHeight - this.height / 2) this.y = canvasHeight - this.height / 2;
}   

Characters.prototype.draw = function() {
    context.save();

    if (this.state === this.states.idle) {
        this.idle();
    } else if (this.state === this.states.wander) {
        this.wander();
    } else if (this.state === this.states.alert) {
        this.alert();
    } else if (this.state === this.states.attack) {
        this.attack();
    } else if (this.state === this.states.death) {
        this.death();
    }

    context.beginPath();
    context.rect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
    context.stroke();

    context.restore();
}

Characters.prototype.idle = function() {
    this.spriteIndex = this.states.idle;

    const x = this.x - this.width / 2;
    const y = this.y - this.height / 2;

    let spriteAnimation = Math.floor(this.spriteAnimationCounter) % 8;

    playerSprite.play(spriteAnimation, x, y);

    // context.drawImage(image, spriteAnimation * cropWidth, this.spriteIndex * cropHeight, cropWidth, cropHeight,
    //     x, y, drawWidth, drawHeight);

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

Characters.prototype.wander = function() {
    this.spriteIndex = 1;

    const x = this.x - this.width / 2;
    const y = this.y - this.height / 2;

    const image = this.image.image;
    const cropWidth = this.image.size;
    const cropHeight = this.image.size;
    const drawWidth = this.width;
    const drawHeight = this.height;

    let mod = 6;
    let spriteAnimation = Math.floor(this.spriteAnimationCounter) % mod;

    context.drawImage(image, spriteAnimation * cropWidth, this.spriteIndex * cropHeight, cropWidth, cropHeight,
        x, y, drawWidth, drawHeight);

    if (!this.pressingRight && !this.pressingLeft && !this.pressingDown && !this.pressingUp) {
        this.state = this.states.idle;
    }
}

// this will be moved to enemy
Characters.prototype.alert = function() {
    console.log('Alert...');

    this.spriteIndex = this.states.wander;
}

Characters.prototype.attack = function() {
    this.spriteIndex = this.states.attack;

    const x = this.x - this.width / 2;
    const y = this.y - this.height / 2;

    const image = this.image.image;
    const cropWidth = this.image.size;
    const cropHeight = this.image.size;
    const drawWidth = this.width;
    const drawHeight = this.height;

    const mod = 5; // number of indexes
    let spriteAnimation = Math.floor(this.attackAnim) % mod;

    document.onmouseup = () => {
        this.isAttacking = false;
    }
    
    if (spriteAnimation === (mod - 1) && !this.isAttacking) {
        this.state = this.states.idle;
    }
    
    context.drawImage(image, spriteAnimation * cropWidth, this.spriteIndex * cropHeight, cropWidth, cropHeight,
        x, y, drawWidth, drawHeight);
}

Characters.prototype.death = function() {
    const x = this.x - this.width / 2;
    const y = this.y - this.height / 2;

    const image = this.image.image;
    const cropWidth = this.image.size;
    const cropHeight = this.image.size;
    const drawWidth = this.width;
    const drawHeight = this.height;

    const mod = 6;
    let spriteAnimation = Math.floor(this.attackAnim) % mod;
    
    if (spriteAnimation === (mod - 1) && this.health === 0) {
        context.drawImage(image, (mod - 1) * cropWidth, 7 * cropHeight, cropWidth, cropHeight,
            x, y, drawWidth, drawHeight);
    } else {
        context.drawImage(image, spriteAnimation * cropWidth, 7 * cropHeight, cropWidth, cropHeight,
            x, y, drawWidth, drawHeight);
    }

    if (player.health > 0) {
        this.state = this.states.idle;
    }
}