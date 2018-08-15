function Maps(src, sourceCol, sourceRow, sourceSize, mapCol, mapRow, mapSize) {
    this.image = {};
    this.map = {
        col: '',
        row: '',
        size: '',
        layers: [],
        getTile: function(layer, col, row) {
            return this.layers[layer][row * this.col + col] + 1;
        }
    }


    this.image.src = new Image();
    this.image.src = src;
    this.image.col = sourceCol;
    this.image.row = sourceRow;
    this.image.size = sourceSize;

    // map
    this.map.col = mapCol;
    this.map.row = mapRow;
    this.map.size = mapSize;
    this.map.layers = [];
};

Maps.prototype.find = function() {
    return this;
}

Maps.prototype.renderMap = function(layer, camera) {
    let map = this.map;
    let image = this.image;

    let startX, startY, counter, tile;

    let startCol = Math.floor(camera.x / map.size);
    let startRow = Math.floor(camera.y / map.size);
    let endRow = Math.ceil((camera.y + camera.height) / map.size) - 1;
    let endCol = Math.ceil((camera.x + camera.width) / map.size) - 1;

    let offsetX = -camera.x + startCol * map.size;
    let offsetY = -camera.y + startRow * map.size;

    for (r = startRow; r <= endRow; r++) {
        for (c = startCol; c <= endCol; c++) {

            counter = 0;
            tile = map.getTile(layer, c, r);

            tileLoop: 
            for (y = 0; y < image.row; y++) {
                for (x = 0; x < image.col; x++) {
                    
                    counter++;
                    if (counter === tile) {
                        startX = x * image.size;
                        startY = y * image.size;
                        break tileLoop;
                    }

                }
            }

            if (tile !== 0) { // 0 => empty tile
                context.drawImage(
                    image.src,          // image
                    startX,               // source x    
                    startY,               // source y
                    image.size,       // source width
                    image.size,       // source height
                    Math.round((c - startCol) * map.size + offsetX),     // position x
                    Math.round((r - startRow) * map.size + offsetY),     // position y
                    map.size,         // width
                    map.size          // height
                );
            }
        }
    }
};

Maps.prototype.isSolidTileAtXY = function(x, y) {
    let map = this.map;

    const col = Math.floor(x / map.size);
    const row = Math.floor(y / map.size);

    // use draw rect function
    context.beginPath();
    context.rect(
        col * map.size, 
        row * map.size,
        map.size,
        map.size
    );
    context.stroke();

    const tile = map.getTile(0, col, row) - 1;

    if (tile === 283) {
        return true;
    } 
}

Maps.prototype.addLayer = function(layer) {
    this.map.layers.push(layer);
}

Maps.prototype.update = function(layer, camera) {
    this.renderMap(layer, camera);
}