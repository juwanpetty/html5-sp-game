function Sprites(src, col, row, sourceSize, desiredSize) {
    this.image = '';
    this.col = col;
    this.row = row;
    this.size = sourceSize;
    this.desiredSize = desiredSize;

    this.image = new Image();
    this.image.src = src;

    this.animationDelay = 0;
    this.animationIndexCounter = 0;
    this.animationCurrentFrame = 0;
};

Sprites.prototype.find = function() {
    return this;
}

Sprites.prototype.findImage = function() {
    return this.image;
}

Sprites.prototype.play = function(x, y, frames) {

    const image = this.find();
    const src = image.image;
    let size = image.size;
    let desiredSize = image.desiredSize;
    let col = image.col;
    let row = image.row;

    if (frames) {
        if (this.animationDelay++ >= 5) {

            this.animationDelay = 0;
            this.animationIndexCounter++;

            if (this.animationIndexCounter >= frames.length) {
                this.animationIndexCounter = 0;
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