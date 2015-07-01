
var gl;
var points;
var numTriangles = 2;
elements = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    var vertices = [-1, -1, -1, 1, 1, -1, 1, 1];
    var colors   = [1,0,0,
                    0,1,0,
                    0,0,1,
                    1,1,1];

        elements = new Uint8Array([0,1,2,
                    1,3,2]);

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var elementid =
    gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementid);
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Load colordata in buffer
    var colorBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation(program, "vColor");

    gl.vertexAttribPointer(vColor,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vColor);

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    // gl.drawArrays( gl.TRIANGLES, 0, 3*numTriangles );
    gl.drawElements(gl.TRIANGLES, 6,gl.UNSIGNED_BYTE,0 );
}
