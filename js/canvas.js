console.log('[INIT] Paper');

var imgPath = 'img/btc.png';

var raster = new Raster(imgPath);   // Create a raster item using the image tag with id='mona'
raster.position = view.center;
var gridSize = 12;  // The size of our grid cells:
var spacing = 1.2;  // Space the cells by 120%:

// As the web is asynchronous, we need to wait for the raster to load
// before we can perform any operation on its pixels.
raster.on('load', rasterReady);


function rasterReady() {
    raster.visible = true; // Hide the raster:
    raster.size = new Size(50, 50); // Downsize the raster

    invert();
//    console.log('Image data %o', raster.getImageData());

//    project.activeLayer.position = view.center; // center view

}

function invert() {
    apply(kernelInvert);
}

function kernelInvert(x,y) {
    var color = raster.getPixel(x,y);
    color = color.convert('gray');
    var newColor = (new Color(0,1)) - color;
//    console.log('[KernelInvert] (%d, %d) %o', x, y, newColor);
    newColor.alpha = 1;
    raster.setPixel(x, y, newColor);
}

/**
 * apply a kernel to the raster. The kernel receives x and y components
 * @param kernel(x,y)
 */
function apply(kernel) {
    for (var y = 0; y < raster.height; y++) {
        for (var x = 0; x < raster.width; x++) {
            kernel(x,y);
        }
    }
}

function rasterize() {
    // Rasterize
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
}