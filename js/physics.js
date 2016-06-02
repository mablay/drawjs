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
    var nodes = Array(columns * rows);
    console.log('[Grid] Nodes %o', nodes);

    function filter(cb) {
        for (var i=columns*rows-1; i>0; i--) {
            nodes[i] = cb(nodes, i);
        }
    }

    return {
        toImageData: function() {
            var data = Array(columns*rows);
            for (var i=columns*rows*4-4; i>0; i=i-4) {
                var v = Math.min(0, Math.max(255, Math.round(nodes[i])));
                data[i] = data[i+1] = data[i+2] = v;
                data[i+3] = 255;    // set opaque
            }
            return data;
        },
        invert: function() {
            filter(function(nodes, i){
               return 255 - nodes[i];
            });
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
        }
    };
}