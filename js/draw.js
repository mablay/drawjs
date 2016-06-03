(function(){

}());

function Draw(canvasElement, width, height) {
    console.log('[Draw] init with canvas element %o and dimensions', canvasElement, width, height);

    this.ctx = canvasElement.getContext('2d');
    console.log('[Draw] Canvas has dimensions %d, %d', ctx.canvas.width, ctx.canvas.height);


    return {
        canvas: canvasElement,
        ctx: ctx,
        /**
         * Get image data from img element
         * @param img <img> html element
         * @returns {ImageData|*}
         */
        load: function(img) {
            this.ctx.canvas.width = width;
            this.ctx.canvas.height = height;
            this.ctx.drawImage(img, 0, 0, width, height);
            //return ctx.getImageData(0,0,img.width,img.height);
        },
        getPixels: function() {
            return this.ctx.getImageData(0,0,ctx.canvas.width, ctx.canvas.height);
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
            for (var i=idata.length-1; i>=0; i--) {
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
            var data = idata.data;
            //console.log('[Filter] filterRGB %o', data);
            for (var i=data.length-4; i>=0; i=i-4) {
                data[i] = cb(data, i);
                data[i+1] = cb(data, i+1);
                data[i+2] = cb(data, i+2);
            }
            return idata;
        },

        /**
         * Takes a number, rounds it to integer and fits it into the 0 - 255 range.
         * @param value
         */
        safeComp: function(value) {
            return Math.min(255, Math.max(0, Math.round(value)));
        },

        /**
         * Fill the canvas with one grayscale value
         * @param value
         */
        fill: function(value) {
            var v = this.safeComp(value);
            console.debug('[DRAW] fill %o, this %o', v, this);
            var idata = this.filterRGB(function() {
               return v;
            });
            this.setPixels(idata);
        },
        /**
         * Takes a texture with one channel float values and copies it into the images 4 channel int values.
         * This updates the canvas
         * @param data
         * @returns {*}
         */
        drawGrayFloat: function(nodes) {
            //var idata = new ImageData(columns, rows);
            /*
            var ctx = this.canvas.getContext('2d');
            var width = this.canvas.width;
            var height = this.canvas.height;
            console.log('[DrawGrayFloat] draw %d nodes to %o %d x %d', nodes.length, ctx, width, height);
            var idata = this.ctx.getImageData(0,0,width, height);
            */
            var idata = this.getPixels();
            var data = idata.data;
            for (var index=nodes.length-1; index>=0; index--) {
                var v = Math.min(255, Math.max(0, Math.round(nodes[index])));
                var i = index*4;
                data[i] = data[i+1] = data[i+2] = v;
                data[i+3] = 255;    // set opaque
            }
            console.log('[DrawGrayFloat] idata %o', idata);
            this.setPixels(idata);
        }
    };
}