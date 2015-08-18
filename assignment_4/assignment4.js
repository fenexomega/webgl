var backgroundColor = vec3(0.1,0.1,0.1)
var gl;
var programNbr;
var vertices = []
var canvas;
var sliders 
var objects = []
var vPosition, vColor
var uview,uproj,umodel,ucolor
var view,proj;
var wireframes = false
var zValue = 0
var selectedFigure = 1
var selectedColor = [0,1,1]
var rotation_sliders = []
var scale_slider 

var figures = {
	cube: 1,
	sphere: 2,
	cone: 3,
	cylinder: 4
}

function clearObjects()
{
	objects = []
}

function setWireframe(element)
{
	wireframes = element.checked
}

function transformSelectedObject()
{
	objects[objects.length-1].transform()
}

function changeColor(value)
{
	selectedColor = [
		parseInt("0x" + value.slice(1,3))/255,
		parseInt("0x" + value.slice(3,5))/255,
		parseInt("0x" + value.slice(5,7))/255,
	]

	objects[objects.length-1].color = selectedColor

}


function selectFigure(value)
{
	console.log("Selected figure is now " + value)
	selectedFigure = value
}

function changeDepth(value)
{
	zValue = -value	
}

function resetGUI()
{
	for (var i = 0, len = rotation_sliders.length; i < len; i++) {
		rotation_sliders[i].value = 0;
	}
	scale_slider.value = 1
}

function initGUI()
{
	rotation_sliders.push(document.getElementById("rotx"))	
	rotation_sliders.push(document.getElementById("roty"))	
	rotation_sliders.push(document.getElementById("rotz"))	
	document.getElementById("distance").value = 0
	document.getElementById("cbxWireframe").checked = false
	document.getElementById("div_geochoose").childNodes[3].checked = true
	document.getElementById("html5colorpicker").value = "#00FFFF"
	scale_slider = document.getElementById("scaletotal")
}





function getHexString(number)
{
	var string = number.toString(16)
	while(string.length < 6)
		string = '0' + string
	return string
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

function initGL()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LESS);
	
	gl.enable(gl.POLYGON_OFFSET_FILL)
	gl.polygonOffset(2,2)
	
}

function ifZero(value)
{
	if(!value)
		return 1
	return value
}


window.onload = function init()
{
	initGL()
	initGUI()
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    gl.viewport( 0, 0, canvas.width, canvas.height );
	
	canvas.addEventListener("mousedown",function(event){
		if(canDraw)
		{
			var pos = getGLMousePosition(event)
			console.log(pos)

			//Really bad code here. That is what you get when 
			//you have pratically zero math and linear algebra background
			//*****
			//Doing some "magic numbers" to compessate the mouse position with the z-depth value
			//Has something to do with the ratio of resolution, but hell if I knew
			//how to explain this sorcery.
			pos = [pos[0]*(1+Math.abs(zValue)),
					pos[1]*(Math.abs(zValue)*0.8+1/ifZero(-zValue)),
					zValue];
			color = selectedColor
			size = 0.5
			createFigure(selectedFigure,pos,color,size)
		}
		canDraw = false
	})
	
	canvas.addEventListener("mouseup",function(event){
		if(!canDraw)
		{
		}
		canDraw = true
	})
	canvas.addEventListener("mousemove",function(event){

	})
	canDraw = true
	
	camera.pushMatrix()

	render()	
};



function render() {
    gl.clearColor( backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	for(var o of objects)
		o.render()
	requestAnimationFrame(render);
}
