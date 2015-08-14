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

}

var camera = {
	pos: [0,0,1.5],
	center: [0,0,0],
	up: [0,1,0],
	pushMatrix: function(){
		this.view = lookAt(
				this.pos,
				this.center,
				this.up);

		uview = gl.getUniformLocation(program,"view")
		gl.uniformMatrix4fv(uview,false,flatten(this.view))

		this.proj = perspective(70,canvas.width/canvas.height,0.1,50)

		uproj = gl.getUniformLocation(program,"proj")
		gl.uniformMatrix4fv(uproj,false,flatten(this.proj))
	},

	translate: function(x,y,z){
		pos = [pos[0]+x,pos[1]+y,pos[2]+z]

	}
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
	document.getElementById("cbxWireframe").checked = false
	document.getElementById("div_geochoose").childNodes[3].checked = true
}

function createObject(varray,earray,color,pos)
{
    // Load the data into the GPU
	resetGUI()
	var m_model = mat4()
	if(pos != undefined)
		m_model = translate(pos[0],pos[1],pos[2])
	
	var obj = { 
		size: earray.length , 
		vsize: varray.length,
		model: m_model,
		pos: pos,
		color: color,
		changeColor: function(vec3Color){
			gl.uniform3fv(ucolor,flatten(vec3Color))
		},
		renderWireframe: function(){
				for(var i = 0; i < this.size ; i += 3)
					gl.drawElements(gl.LINE_LOOP,3,gl.UNSIGNED_SHORT,i*2)
		},
		renderFull: function(){
			gl.drawElements(gl.TRIANGLES,this.size,gl.UNSIGNED_SHORT,0)
			this.changeColor([0,0,0])
			this.renderWireframe()
		},
		transform: function(){
				var rotx = rotate(rotation_sliders[0].value,[1,0,0])
				var roty = rotate(rotation_sliders[1].value,[0,1,0])
				var rotz = rotate(rotation_sliders[2].value,[0,0,1])
				this.model = mult(rotz,mult(roty,rotx))
				this.model = mult(translate(this.pos),this.model)
		},
		render: function(){
			gl.uniformMatrix4fv(umodel,false,flatten(this.model))
			this.changeColor(color)
			// NOTE: como não há Vertex Array Object, 
			// eu tenho de sempre realocar os ponteiros para a placa de 
			// video.
			gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
			gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo)
			if(wireframes)
			{
				this.renderWireframe()
			}
			else
			{
				this.renderFull()
			}
		}
	}	


    obj.vbo = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, obj.vbo );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(varray), gl.STATIC_DRAW );

	obj.ebo = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.ebo)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(earray) , gl.STATIC_DRAW)

    // Associate out shader variables with our data buffer
	gl.bindBuffer(gl.ARRAY_BUFFER,obj.vbo)

    if(!vPosition)
		vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPosition );

	gl.bindBuffer(gl.ARRAY_BUFFER,obj.cbo)

	if(!ucolor)
		ucolor = gl.getUniformLocation(program,"uColor")

	if(!umodel)
		umodel = gl.getUniformLocation(program,"model")

	console.log("[DEBUG] Creating object")
	return obj 
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
			//TODO get color and size from UI
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
