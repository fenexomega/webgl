var vPosition, vNormal

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

		var uvextexPos = gl.getUniformLocation(program,"vertexPos")
		gl.uniform3fv(uvextexPos,this.pos)
	},

	translate: function(x,y,z){
		pos = [pos[0]+x,pos[1]+y,pos[2]+z]

	}
}

function createObject(varray,earray,narray,color,pos)
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
		//	gl.drawElements(gl.TRIANGLES,this.size,gl.UNSIGNED_SHORT,0)
			gl.drawArrays(gl.TRIANGLES,0,this.vsize)
			this.changeColor([0,0,0])
//			this.renderWireframe()
		},
		transform: function(){
				this.model = scalem(1.0,1.0,1.0)
				var rotx = rotate(rotation_sliders[0].value,[1,0,0])
				var roty = rotate(rotation_sliders[1].value,[0,1,0])
				var rotz = rotate(rotation_sliders[2].value,[0,0,1])
				this.model = mult(rotz,mult(roty,mult(rotx,this.model)))
				this.model = mult(translate(this.pos),this.model)
		},
		render: function()
		{
			gl.uniformMatrix4fv(umodel,false,flatten(this.model))
			this.changeColor(this.color)
			// NOTE: como não há Vertex Array Object, 
			// eu tenho de sempre realocar os ponteiros para a placa de 
			// video.
			gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
			gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo)
			gl.bindBuffer(gl.ARRAY_BUFFER,this.nbo)
			gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0,0)
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

	obj.nbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.nbo)
	gl.bufferData(gl.ARRAY_BUFFER,flatten(narray),gl.STATIC_DRAW)

	gl.bindBuffer(gl.ARRAY_BUFFER,obj.vbo)

    if(!vPosition)
		vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPosition );

	if(!vNormal)
		vNormal = gl.getAttribLocation( program,"vNormal")
	gl.enableVertexAttribArray(vNormal)


	if(!ucolor)
		ucolor = gl.getUniformLocation(program,"uColor")

	if(!umodel)
		umodel = gl.getUniformLocation(program,"model")

	console.log("[DEBUG] Creating object")
	return obj 
}
