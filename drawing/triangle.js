var backgroundColor = vec3(0.5,0.5,0.5)
var maxLines = 2000000
var gl;
var programNbr;
var vertices = []
var canvas;
var sliders 
var clCanvasCtx
var lineWidth = 1

function initUI()
{
	sliders[0].value = 0
	sliders[1].value = 255*0.8
	sliders[2].value = 255*1
	sliders[3].value = 1
	changeColor()
}

function changeLineWidth(num)
{
	lineWidth = num
	gl.lineWidth(lineWidth)
	render()
}

function canvasClear()
{
	vertices = []
	render()
}

function getSliders()
{
	sliders = []
	sliders.push(document.getElementById("slidR"))
	sliders.push(document.getElementById("slidG"))
	sliders.push(document.getElementById("slidB"))
	sliders.push(document.getElementById("slidLineWidth"))
	clCanvasCtx = document.getElementById("color-canvas").getContext('2d')
}

function getHexString(number)
{
	var string = number.toString(16)
	while(string.length < 6)
		string = '0' + string
	return string
}

function changeColor()
{
	var value = 0
	color = vec3(sliders[0].value/255,
				 sliders[1].value/255,
				 sliders[2].value/255)
	for(var i = 0; i < 3; ++i)
		value += Number(sliders[i].value) << 8*(2-i)
	var colorString = "#" + getHexString(value)
	console.log(colorString)
	clCanvasCtx.fillStyle = colorString
	clCanvasCtx.fillRect(0,0,64,64)

}

function getGLMousePosition(event)
{
	return [2*(event.clientX-canvas.offsetLeft)/canvas.width-1,
			1-(2*(event.clientY-canvas.offsetTop)/canvas.height)]
}

function addVertexFromMouse(event)
{
	var t = getGLMousePosition(event)
	vertices.push(t);
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferId)
	gl.bufferSubData(gl.ARRAY_BUFFER,(vertices.length-1)*8,flatten(t))
	gl.bindBuffer(gl.ARRAY_BUFFER,colorBufferId)
	gl.bufferSubData(gl.ARRAY_BUFFER,(vertices.length-1)*12,flatten(color))
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
	getSliders()
	initUI()
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    gl.viewport( 0, 0, canvas.width, canvas.height );
	
    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, maxLines*8, gl.STATIC_DRAW );

	colorBufferId = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId)
	gl.bufferData(gl.ARRAY_BUFFER, maxLines*12, gl.STATIC_DRAW)

	canvasClear()
    // Associate out shader variables with our data buffer
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferId)
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	gl.bindBuffer(gl.ARRAY_BUFFER,colorBufferId)
	var	vColor = gl.getAttribLocation( program, "vColor")
	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0,0);
	gl.enableVertexAttribArray(vColor)
	
	gl.enable(gl.LINE_SMOOTH)

	canvas.addEventListener("mousedown",function(event){
		if(!canDraw)
		{
			addVertexFromMouse(event)
		}
		canDraw = true
	})
	
	canvas.addEventListener("mouseup",function(event){
		if(canDraw)
		{
			addVertexFromMouse(event)
		}
		canDraw = false
	})
	canvas.addEventListener("mousemove",function(event){
		if(!canDraw)
			return
		var t = getGLMousePosition(event)
		vertices.push(t);
		vertices.push(t);
		gl.bindBuffer(gl.ARRAY_BUFFER,bufferId)
		gl.bufferSubData(gl.ARRAY_BUFFER,(vertices.length-2)*8,flatten(t))
		gl.bufferSubData(gl.ARRAY_BUFFER,(vertices.length-1)*8,flatten(t))
		gl.bindBuffer(gl.ARRAY_BUFFER,colorBufferId)
		gl.bufferSubData(gl.ARRAY_BUFFER,(vertices.length-2)*12,flatten(color))
		gl.bufferSubData(gl.ARRAY_BUFFER,(vertices.length-1)*12,flatten(color))
		render()
	})
	canDraw = false
	render()
};



function render() {
    gl.clearColor( backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.LINES, 0, vertices.length);
}
