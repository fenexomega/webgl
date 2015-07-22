var color = vec3(0.5,0.5,0.5)
var maxLines = 2000000
var gl;
var programNbr;
var vertices = []
var canvas;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	programNbr = program;
    gl.viewport( 0, 0, canvas.width, canvas.height );
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, maxLines*8, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( programNbr, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	canvas.addEventListener("mousedown",function(event){
		canDraw = true
	})
	
	canvas.addEventListener("mouseup",function(event){
		canDraw = false
	})
	canvas.addEventListener("mousemove",function(event){
		if(!canDraw)
			return
		var t = [2*event.clientX/canvas.width-1,
				1-(2*event.clientY/canvas.height)]
		vertices.push(t);
		gl.bufferSubData(gl.ARRAY_BUFFER,(vertices.length-1)*8,flatten(t))
		render()
	})
	canDraw = false
};



function render() {
    gl.clearColor( color[0], color[1], color[2], 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.LINE_STRIP, 0, vertices.length);
}
