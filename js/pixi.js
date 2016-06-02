/**
 * Created by marc on 6/2/16.
 */


var renderer = PIXI.autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);

console.log('[render] %o', renderer);

// create the root of the scene graph
var stage = new PIXI.Container();

var bg = PIXI.Sprite.fromImage('img/pixi/depth_blur_BG.jpg');
bg.width = renderer.width;
bg.height = renderer.height;
stage.addChild(bg);


var littleRobot = PIXI.Sprite.fromImage('img/pixi/depth_blur_moby.jpg');
littleRobot.position.x = (renderer.width / 2) - 200;
littleRobot.position.y = 100;
stage.addChild(littleRobot);

var blurFilter1 = new PIXI.filters.BlurFilter();

littleRobot.filters = [blurFilter1];

var count = 0;

requestAnimationFrame(animate);

function animate() {
    requestAnimationFrame( animate );

    count += 0.05;

    var blurAmount = Math.cos(count) ;
    blurFilter1.blur = 10 * (blurAmount);

    renderer.render(stage);
}

