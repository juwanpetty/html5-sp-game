let context = document.querySelector("canvas").getContext("2d");

export function Sprites(src, col, row, sourceSize, desiredSize) {
    this.src = '';
    this.col = col;
    this.row = row;
    this.size = sourceSize;
    this.desiredSize = desiredSize;

    this.src = new Image();
    this.src.src = src;

    this.animationDelay = 0;
    this.animationIndexCounter = 0;
    this.animationCurrentFrame = 0;
};

Sprites.prototype.find = function() {
    return this;
}

Sprites.prototype.findImage = function() {
    return this.src;
}

Sprites.prototype.play = function(x, y, frames, loop = true) {

    const image = this.find();
    const src = image.src;
    let size = image.size;
    let desiredSize = image.desiredSize;
    let col = image.col;
    let row = image.row;

    if (frames) {
        if (this.animationDelay++ >= 5) {

            this.animationDelay = 0;
            this.animationIndexCounter++;            

            if (this.animationIndexCounter >= frames.length && loop) {
                this.animationIndexCounter = 0;
            }

            // loop logic
            if (this.animationIndexCounter === frames.length) {
                this.animationIndexCounter = frames.length - 1;
            }

            this.animationCurrentFrame = frames[this.animationIndexCounter];

        }

        let spriteSheetX = this.animationCurrentFrame % col;
        let spriteSheetY = Math.floor(this.animationCurrentFrame / row);

        context.drawImage(
            src,
            spriteSheetX * size,
            spriteSheetY * size,
            size,
            size,
            x,
            y,
            desiredSize,
            desiredSize
        );
    }
}