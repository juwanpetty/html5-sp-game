function Cameras(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

Cameras.prototype.update = function(x, y) {
    this.drawCamera();
    this.updateCameraPosition(x, y);
}

Cameras.prototype.drawCamera = function() {
    context.save();

    context.beginPath();
    context.rect(canvasWidth / 2 - camera.width / 2 , canvasHeight / 2 - camera.height / 2, this.width, this.height);
    context.stroke(); 
    context.strokeStyle = '#FF0000';

    context.restore();
}

Cameras.prototype.updateCameraPosition = function(x, y) {
    this.x = x - (this.width / 2);
    this.y = y - (this.height / 2);
};