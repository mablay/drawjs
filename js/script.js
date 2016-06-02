/**
 * Created by marc on 6/2/16.
 */

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('[onload] ');
    var srcImg = document.getElementById('initState');
    var canvas = document.getElementById('surface');
    var draw = new Draw(canvas, 50, 50);
    draw.fill(127);
    draw.load(srcImg);
    //draw.paint();

    //var sys = new System();
    //sys.init(img);
    //sys.start(31);
});
    




function System() {

    var img;
    var ctx;
    var iterationCount = 0;

    return {
        init: function(_img) {
            window.sys = this;
            this.img = _img;
            console.log('[Init] ');
            var c = document.getElementById('surface');
            var idata = Filters.filterImage(Filters.invert, this.img, null, null, null);
            c.width = idata.width;
            c.height = idata.height;
            this.ctx = c.getContext('2d');
            this.ctx.putImageData(idata, 0, 0);
        },
        start: function(len) {
            this.iterationCount = len;
            this.simulate();
        },
        simulate: function(len) {
            window.sys.iterate();
            console.log('[Simulate] sys %o', window.sys);
            if (window.sys.iterationCount > 0) window.requestAnimationFrame(window.sys.simulate);
        },
        iterate: function() {
            console.log('[Iterate] count %d', window.sys.iterationCount--);
            console.log('[Iterate] ctx %o', this.ctx);
            var srcData = this.ctx.getImageData(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
            var idata = Filters.filterImageData(Filters.invert, srcData, null, null, null);
            this.ctx.putImageData(idata, 0, 0);
        }        
    };
}

var grayscale = function() {
    runFilter('grayscale', Filters.grayscale);
};

var brightness = function() {
    runFilter('brightness', Filters.brightness, 40);
};

var threshold = function() {
    runFilter('threshold', Filters.threshold, 128);
};

var sharpen = function() {
    runFilter('sharpen', Filters.convolute,
        [ 0, -1,  0,
            -1,  5, -1,
            0, -1,  0]);
};

var blurC = function() {
    runFilter('blurC', Filters.convolute,
        [ 1/9, 1/9, 1/9,
            1/9, 1/9, 1/9,
            1/9, 1/9, 1/9 ]);
};

var sobel = function() {
    runFilter('sobel', function(px) {
        px = Filters.grayscale(px);
        var vertical = Filters.convoluteFloat32(px,
            [-1,-2,-1,
                0, 0, 0,
                1, 2, 1]);
        var horizontal = Filters.convoluteFloat32(px,
            [-1,0,1,
                -2,0,2,
                -1,0,1]);
        var id = Filters.createImageData(vertical.width, vertical.height);
        for (var i=0; i<id.data.length; i+=4) {
            var v = Math.abs(vertical.data[i]);
            id.data[i] = v;
            var h = Math.abs(horizontal.data[i]);
            id.data[i+1] = h;
            id.data[i+2] = (v+h)/4;
            id.data[i+3] = 255;
        }
        return id;
    });
};

var custom = function() {
    var inputs = document.getElementById('customMatrix').getElementsByTagName('input');
    var arr = [];
    for (var i=0; i<inputs.length; i++) {
        arr.push(parseFloat(inputs[i].value));
    }
    runFilter('custom', Filters.convolute, arr, true);
};
