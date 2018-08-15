function Sprites(src, col, row, sourceSize, desiredSize) {
    this.image = '';
    this.col = col;
    this.row = row;
    this.size = sourceSize;
    this.desiredSize = desiredSize;

    this.image = new Image();
    this.image.src = src;
};

Sprites.prototype.find = function() {
    return this;
}

Sprites.prototype.findImage = function() {
    return this.image;
}

Sprites.prototype.play = function(frames, posX, posY) {

    const image = this.find();
    const src = image.image;
    let size = image.size;
    let desiredSize = image.desiredSize;
    let col = image.col;
    let row = image.row;
  
    // for (frameIndex = 0; frameIndex < frames.length; frameIndex++) {
      
    //     let counter = 0;
            
    //     for (let y = 0; y < row; y++) {
    //         for (let x = 0; x < col; x++) {
            
    //             if (counter === frames[frameIndex]) {
                    context.drawImage(
                        src,
                        frames * size,
                        0 * size,
                        size,
                        size,
                        posX,
                        posY,
                        desiredSize,
                        desiredSize
                    );
    //             }

    //             counter++;
    //         }
    //     }
    // }
}