let context = document.querySelector("canvas").getContext("2d");

// let canvasWidth = document.documentElement.clientWidth;
// let canvasHeight = document.documentElement.clientHeight;
let canvasWidth = 800;
let canvasHeight = 600;

// Camera
let camera = new Cameras(200, 200, 800, 600);

// Map
let overworld = new Maps('img/overworld.png', 40, 36, 16, 20, 20, 64);
overworld.addLayer([
    0,0,0,0,0,0,0,200,201,201,201,201,201,201,201,201,201,201,202,0,
    0,0,0,1174,1175,1176,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,1214,1215,1216,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,1254,1255,1256,0,0,0,242,243,243,243,243,243,243,244,0,0,0,
    0,0,0,1160,1161,1162,0,0,0,282,283,283,283,283,283,283,284,0,0,0,
    0,0,0,1200,1201,1202,0,0,0,282,124,283,283,283,125,283,284,0,0,0,
    0,0,0,1200,1360,1202,0,0,0,282,283,283,283,362,363,283,284,0,0,0,
    0,0,0,1200,1201,1202,0,0,0,282,283,283,283,402,403,283,284,0,0,0,
    1161,1161,1161,1161,1201,1202,1174,1175,1176,282,283,283,124,283,283,283,284,0,0,0,
    1201,1201,1360,1201,1201,1202,1214,1215,1216,282,283,362,323,323,323,323,324,0,0,0,
    1241,1241,1241,1241,1241,1242,1254,1255,1256,322,323,324,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,1174,1175,1176,0,0,0,242,243,243,244,0,
    0,0,0,0,0,0,0,0,0,1214,1215,1216,0,0,0,282,362,363,284,0,
    0,0,1174,1175,1176,0,0,0,0,1254,1255,1256,0,0,0,282,402,403,284,0,
    0,0,1214,1215,1216,0,0,0,0,0,0,0,0,0,365,322,323,323,324,0,
    0,0,1254,1255,1256,0,0,0,367,368,364,365,365,365,405,365,365,365,365,366,
    0,0,0,0,0,0,0,0,367,368,404,405,405,405,405,405,405,405,405,406,
    0,0,0,0,0,0,0,0,407,408,444,445,445,445,445,445,445,445,445,446,
    0,0,0,0,0,0,0,0,0,0,484,484,524,525,526,484,484,524,525,526
]);

// Character
let player = new Characters('Player 1');

// Movement Controls
document.onkeydown = event => {
    if(event.keyCode === 68)        //d
            player.pressingRight = true;
    else if(event.keyCode === 83)   //s
            player.pressingDown = true;
    else if(event.keyCode === 65) //a
            player.pressingLeft = true;
    else if(event.keyCode === 87) // w
            player.pressingUp = true;
}

document.onkeyup = event => {
    if(event.keyCode === 68)        //d
            player.pressingRight = false;
    else if(event.keyCode === 83)   //s
            player.pressingDown = false;
    else if(event.keyCode === 65) //a
            player.pressingLeft = false;
    else if(event.keyCode === 87) // w
            player.pressingUp = false;
} 

document.onmousemove = event => {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    mouseX -= player.x;
    mouseY -= player.y;

    // console.log(Math.atan2(mouseY, mouseX) / Math.PI * 180);
    player.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;
}



const update = () => {
    window.requestAnimationFrame(update);

    // Get width and height on every frame 
//     context.canvas.width = document.documentElement.clientWidth;
//     context.canvas.height = document.documentElement.clientHeight;

    context.imageSmoothingEnabled = false;

    // update objects
    overworld.update(0, camera);
    player.update();
    camera.update(player.x, player.y);
}

update();