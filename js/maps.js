import { Sprites } from './sprites';

let context = document.querySelector("canvas").getContext("2d");
let canvasWidth = 800;
let canvasHeight = 600;

export function Maps(src, sourceCol, sourceRow, sourceSize, mapCol, mapRow, mapSize) {
    this.image = new Sprites(src, sourceCol, sourceRow, sourceSize, mapSize);
    this.map = {
        col: '',
        row: '',
        size: '',
        layers: [],
        getTile: function(layer, col, row) {
            return this.layers[layer][row * this.col + col] + 1;
        },
        isSolidTileAtXY: function (x,y) {
            const col = Math.floor(x / this.size);
            const row = Math.floor(y / this.size);

            const tile = this.getTile(0, col, row) - 1;

            if (tile === 283) {
                // use draw rect function
                context.globalAlpha = 0.5;
    
                context.fillStyle = 'red';
                context.fillRect(
                    col * this.size, 
                    row * this.size,
                    this.size, 
                    this.size
                );

                context.globalAlpha = 1.0;

                return true;
            }

        },
        getCol: function (x) {
            return Math.floor(x / this.size);
        },
        getRow: function (y) {
            return Math.floor(y / this.size);
        },
        getX: function (col) {
            return col * this.size;
        },
        getY: function (row) {
            return row * this.size;
        }
    }

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
    let endRow = Math.ceil((camera.y + camera.height) / map.size);
    let endCol = Math.ceil((camera.x + camera.width) / map.size);

    if (startCol < 0) startCol = 0;
    if (startRow < 0) startRow = 0;
    if (endCol > map.col) endCol = map.col;
    if (endRow > map.row) endRow = map.row;

    for (let r = startRow; r < endRow; r++) {
        for (let c = startCol; c < endCol; c++) {

            counter = 0;
            tile = map.getTile(layer, c, r);

            tileLoop: 
            for (let y = 0; y < image.row; y++) {
                for (let x = 0; x < image.col; x++) {
                    
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
                    Math.round(c * map.size - camera.x + canvasWidth / 2 - camera.width / 2),     // position x
                    Math.round(r * map.size - camera.y + canvasHeight / 2 - camera.height / 2),     // position y
                    map.size,         // width
                    map.size          // height
                );
            }
        }
    }
}

Maps.prototype.drawGrid = function(camera) {
    let map = this.map;

    var width = map.col * map.size;
    var height = map.row * map.size;
    var x, y;
    for (var r = 0; r < map.row; r++) {
        x = - camera.x;
        y = r * map.size - camera.y;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(width, y);
        context.stroke();
    }

    for (var c = 0; c < map.col; c++) {
        x = c * map.size - camera.x;
        y = - camera.y;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, height);
        context.stroke();
    }
};

Maps.prototype.addLayer = function(layer) {
    this.map.layers.push(layer);
}

Maps.prototype.update = function(layer, camera) {
    this.renderMap(layer, camera);
    // this.drawGrid(camera);
}