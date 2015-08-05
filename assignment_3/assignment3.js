var backgroundColor = vec3(0.1,0.1,0.1)
var gl;
var programNbr;
var vertices = []
var canvas;
var sliders 
var objects = []
var vPosition, vColor
var uview,uproj,umodel;
var view,proj;
var wireframes = true

function createObject(varray,earray,carray,pos)
{
    // Load the data into the GPU
	var m_model = mat4()
	if(pos != undefined)
		m_model = translate(pos[0],pos[1],pos[2])
	
	var obj = { 
		size: earray.length , 
		model: m_model,
		render: function(){
			console.log("[DEBUG] Rendering object")
			gl.uniformMatrix4fv(umodel,false,flatten(this.model))
			// NOTE: como não há Vertex Array Object, 
			// eu tenho de sempre realocar os ponteiros para a placa de 
			// video.
			gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
			gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
			gl.bindBuffer(gl.ARRAY_BUFFER,obj.cbo)
			gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0,0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo)
			if(wireframes)
			{
				for(i = 0; i < this.size ; i += 4)
					gl.drawArrays(gl.LINE_LOOP,i,4);
			}
			else
				gl.drawElements(gl.TRIANGLES,this.size,gl.UNSIGNED_BYTE,0)
		}
	}	


    obj.vbo = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, obj.vbo );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(varray), gl.STATIC_DRAW );

	obj.cbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.cbo)
	gl.bufferData(gl.ARRAY_BUFFER,flatten(carray) , gl.STATIC_DRAW)
	
	obj.ebo = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.ebo)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint8Array(earray) , gl.STATIC_DRAW)

    // Associate out shader variables with our data buffer
	gl.bindBuffer(gl.ARRAY_BUFFER,obj.vbo)

    if(!vPosition)
		vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPosition );

	gl.bindBuffer(gl.ARRAY_BUFFER,obj.cbo)
	if(!vColor)
		vColor = gl.getAttribLocation( program, "vColor")
	gl.enableVertexAttribArray(vColor)

	if(!uview)
	{
		uview = gl.getUniformLocation(program,"view")
		gl.uniformMatrix4fv(uview,false,flatten(view))
	}
	if(!uproj)
	{
		uproj = gl.getUniformLocation(program,"proj")
		gl.uniformMatrix4fv(uproj,false,flatten(proj))
	}

	if(!umodel)
		umodel = gl.getUniformLocation(program,"model")

	console.log("[DEBUG] Creating object")
	return obj 
}

function initUI()
{
}


function getSliders()
{
	sliders = []
	sliders.push(document.getElementById("slidR"))
	sliders.push(document.getElementById("slidG"))
	sliders.push(document.getElementById("slidB"))
	sliders.push(document.getElementById("slidLineWidth"))
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

function initGL()
{
    canvas = document.getElementById( "gl-canvas" );
	getSliders()
	initUI()
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	gl.enable(gl.DEPTH_TEST)
	
}



window.onload = function init()
{
	initGL()
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    gl.viewport( 0, 0, canvas.width, canvas.height );
	
	canvas.addEventListener("mousedown",function(event){
		if(canDraw)
		{
			var pos = getGLMousePosition(event)
			createCube(0.5,[0,1,1],[pos[0]*(1+Math.abs(1)),pos[1]*(1+Math.abs(1)),-1])
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
	view = lookAt(
			[0,0, 1.5],
			[0,0,0],
			[0,1,0]
			);

	console.log(canvas.width/canvas.height)
	proj = perspective(70,canvas.width/canvas.height,10,0.1)
	
};



function render() {
    gl.clearColor( backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	for(var o of objects)
		o.render()
//	requestAnimationFrame(render);
}
