console.log('[INIT] Paper');

var imgPath = 'img/btc.png';

var raster = new Raster(imgPath);   // Create a raster item using the image tag with id='mona'
var gridSize = 12;  // The size of our grid cells:
var spacing = 1.2;  // Space the cells by 120%:

// As the web is asynchronous, we need to wait for the raster to load
// before we can perform any operation on its pixels.
raster.on('load', initPaper);

// Move the active layer to the center of the view:
project.activeLayer.position = view.center;



function initPaper() {
    // Hide the raster:
    raster.visible = false;

    // Since the example image we're using is much too large,
    // and therefore has way too many pixels, lets downsize it to
    // 40 pixels wide and 30 pixels high:
    raster.size = new Size(50, 50);

    for (var y = 0; y < raster.height; y++) {
        for(var x = 0; x < raster.width; x++) {
            // Get the color of the pixel:
            var color = raster.getPixel(x, y);

            // Create a circle shaped path:
            var path = new Path.Rectangle({
                point: new Point(x, y) * gridSize,
                size: gridSize / spacing
            });

            // Set the fill color of the path to the color
            // of the pixel:
            path.fillColor = color;
        }
    }

    // Move the active layer to the center of the view, so all
    // the created paths in it appear centered.
    project.activeLayer.position = view.center;
}