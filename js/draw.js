/**
 * Created by marc on 6/2/16.
 */

function Draw(canvasElement, width, height) {
    console.log('[Draw] init with canvas element %o', canvasElement);

    // register globals
    window.draw = this;
    this.canvas = canvasElement;

    // init canvas
    this.width = width;
    this.height= height;
    this.canvas.width = width;
    this.canvas.height = height;
    var ctx = this.ctx = this.canvas.getContext('2d');
    console.log('[Draw] Canvas has dimensions %d, %d', this.ctx.canvas.width, this.ctx.canvas.height);

    //this.ctx.putImageData(idata, 0, 0);



    return {
        /**
         * Get image data from img element
         * @param img <img> html element
         * @returns {ImageData|*}
         */
        load: function(img) {
            console.log('[Load] ctx %o', ctx);
            ctx.drawImage(img, 0, 0);
            //return ctx.getImageData(0,0,img.width,img.height);
        },
        getPixels: function() {
            return ctx.getImageData(0,0,ctx.canvas.width, ctx.canvas.height);
        },
        setPixels: function(idata) {
            this.ctx.putImageData(idata, 0, 0);
        },
        /**
         * apply a callback to all channels
         * @param cb cb(imageData, index) return the new value for the corresponding index
         */
        filter: function filter(cb) {
            idata = this.getPixels();
            for (var i=idata.length-1; i>0; i--) {
                idata[i] = cb(idata, i);
            }
            return idata;
        },
        /**
         * apply a callback to all color channels
         * @param cb cb(imageData, index) return the new value for the corresponding index
         */
        filterRGB: function filter(cb) {
            idata = this.getPixels();
            for (var i=idata.length-4; i>0; i=i-4) {
                idata[i] = cb(idata, i);
                idata[i+1] = cb(idata, i+1);
                idata[i+2] = cb(idata, i+2);
            }
            return idata;
        },

        /**
         * Takes a number, rounds it to integer and fits it into the 0 - 255 range.
         * @param value
         */
        safeComp: function(value) {
            return Math.min(0, Math.max(255, Math.round(value)));
        },

        /**
         * Fill the canvas with one grayscale value
         * @param value
         */
        fill: function(value) {
            var v = this.safeComp(value);
            this.filterRGB(function(){
               return v;
            });
        },

        start: function(len) {
            this.iterationCount = len;
            this.simulate();
        },
        simulate: function(len) {
            window.draw.iterate();
            console.log('[Simulate] draw %o', window.draw);
            if (window.draw.iterationCount > 0) window.requestAnimationFrame(window.draw.simulate);
        },
        iterate: function() {
            console.log('[Iterate] count %d', window.draw.iterationCount--);
            console.log('[Iterate] ctx %o', this.ctx);
            var srcData = this.ctx.getImageData(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
            var idata = Filters.filterImageData(Filters.invert, srcData, null, null, null);
            this.ctx.putImageData(idata, 0, 0);
        }
    };
}