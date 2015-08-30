var backgroundColor = vec3(0.05,0.05,0.05)
var gl;
var programNbr;
var vertices = []
var canvas;
var sliders 
var objects = []
var uview,uproj,umodel,ucolor,umaterialIndex
var view,proj;
var wireframes = false
var zValue = 0
var selectedFigure = 1
var selectedColor = [0,1,1]
var rotation_sliders = []
var scale_slider 
var selectedMaterial = 0
/*****/
var DEBUG = true

function LOG_DEBUG(string)
{
	if(DEBUG)
		console.log("[DEBUG] " + string)
}
/*****/
var figures = {
	cube: 1,
	sphere: 2,
	cone: 3,
	cylinder: 4
}

function initScene()
{
	var l1 = createLight(0,[0,0,-1],0.5,0.5,[1,1,1])	
	var l2 = createLight(0,[0,-1,0],0.5,0.5,[1,1,1])	
	addLightInList(l1)
	addLightInList(l2)
	l2.rotationDir = [1,0,0]
	
	createFigure(figures.cylinder,[-1.525,-0.9,-1],[1,0,1],0.5)
	selectedMaterial = 3
	createFigure(figures.sphere,[1.285,-0.816,-1],[1,0,1],0.5)
	selectedMaterial = 5
	createFigure(figures.cylinder,[0.632,0.57,-1],[1,0,1],0.5)
	selectedMaterial = 6
	createFigure(figures.sphere,[-0.672,0.373,-0],[1,0,1],0.5)
	selectedMaterial = 0
	
}

function addLight()
{
	var light = createAmbientLight([0,0,-1],0.3,0.6,[1,1,1])
	addLightInList(light)
}

function addLightInList(light,object)
{
	var list = document.getElementById("listLights")
	var element = document.createElement("li")
	var div = (document.createElement("div"))

	div.innerHTML =  "Light " + lights.indexOf(light)
	div.appendChild(document.createElement("input"))
	div.lastChild.type = "checkbox"
	div.lastChild.checked = true
	div.lastChild.value = "1"
	div.lastChild.lightNum = lights.indexOf(light)
	div.lastChild.object = object
	div.lastChild.onchange = function() {
		light.active = this.checked ? 1 : 0
		if(this.object != undefined)
		{
			if(this.checked)
				this.object.color = [1,1,1]
			else
				this.object.color = [0,0,0]
		}
	}
	element.appendChild(div)
	list.appendChild(element)
	return div
}

function setCheckboxMaterial(object)
{
	selectedMaterial = object.selectedIndex	
}

function clearObjects()
{
	var aux = []
	for(var o of objects)
		if(o.emmitsLight != undefined)
			aux.push(o)
	objects = aux
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
}

function initGUI()
{
	rotation_sliders.push(document.getElementById("rotx"))	
	rotation_sliders.push(document.getElementById("roty"))	
	rotation_sliders.push(document.getElementById("rotz"))	
	document.getElementById("distance").value = 0
	document.getElementById("div_geochoose").childNodes[3].checked = true
	spotLightRadioButton = document.getElementById("lightOptionSpot")
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
			if(spotLightRadioButton.checked)
			{
				var lightCube =	createFigure(figures.cube,pos,[1,1,1],0.05)
				lightCube.emmitsLight = true 
				LOG_DEBUG("I choose a lightcube!")
				var light =	createLight(lightTypes.POINT,pos,0.2,0.5,[1,1,1])
				addLightInList(light,lightCube)

			}
			else
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

	initScene()
};



function render() {
	for(var l of lights)
		l.update()
    gl.clearColor( backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	for(var o of objects)
		o.render()
	requestAnimationFrame(render);
}
