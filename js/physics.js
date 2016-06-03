/**
 * Created by marc on 6/2/16.
 */

/** Creates a Mesh with nodes in fixed positions.
 *  Each node is embeded in a 3D space where the first two dimensions are fixed in the grid.
 *  The third dimension is free but bound to neighbouring nodes by forces.
 * @param columns
 * @param rows
 * @constructor
 */
function Grid(columns, rows) {

    // Init the grid
    var nodes = new Array(columns * rows);
    console.log('[Grid] Nodes %o', nodes);


    return {
        nodes: nodes,
        width: columns,
        height: rows,
        init: function init(idata) {
            var data = idata.data;
            this.filter(function(nodes, i) {
                return data[i*4];
            });
        },
        filter: function filter(cb) {
            for (var i=columns*rows-1; i>0; i--) {
                this.nodes[i] = cb(this.nodes, i);
            }
        },
        invert: function() {
            this.filter(function(nodes, i){
               return 255 - nodes[i];
            });
            console.log('[Invert] nodes %o', this.nodes);
        },
        randomize: function () {
            filter(function(nodes, i){
               return Math.floor(Math.random()*256);
            });
        },
        /**
         * Fill all nodes with value
         * @param value from 0 to 255
         */
        fill: function (value) {
            var v = Math.min(0, Math.max(255, value));
            filter(function(nodes, i) { return v; });
        },

        start: function(len) {
            window.sys.iterationCount = len;
            this.simulate();
        },
        simulate: function() {
            window.sys.iterate();
            console.log('[Simulate] draw %o', window.sys);
            if (window.sys.iterationCount > 0) window.requestAnimationFrame(window.sys.simulate);
        },
        iterate: function() {
            //console.log('[Iterate] count %d', window.draw.iterationCount--);
            //console.log('[Iterate] ctx %o', this.ctx);
            window.sys.randomize();
            window.draw.drawGrayFloat(window.sys.nodes);
            //var idata = Filters.filterImageData(Filters.invert, srcData, null, null, null);
            //this.ctx.putImageData(idata, 0, 0);
        }
    };
}