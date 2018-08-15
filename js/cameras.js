function Cameras(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

Cameras.prototype.update = function() {
    // this.updateCameraPosition();
    this.drawCamera();
}

Cameras.prototype.drawCamera = function() {
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.stroke(); 
}

Cameras.prototype.updateCameraPosition = function() {
    this.x = player.x - (this.width / 2);
    this.y = player.y - (this.height / 2);
};