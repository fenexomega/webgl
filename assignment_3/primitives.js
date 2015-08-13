var cubePrototype
var spherePrototype
var cylinderPrototype
var conePrototype

function createFigure(figureId,pos,color,size)
{
	switch(figureId)
	{
		case figures.cube:
			createCube(size,color,pos)
			break
		case figures.sphere:
			createSphere(size,color,pos)
			break
		case figures.cylinder:
			createCylinder(16,color,pos)


	}
}
// TODO reuse the vertex & index buffers!
// TODO use the prototype pattern
function createCube(cubeSize,cubeColor,cubePos)
{
	var varray = []
	var carray = []
	var earray = []

	varray.push(
		//FRONT
		[-cubeSize/2, cubeSize/2,cubeSize/2],
		[-cubeSize/2,-cubeSize/2,cubeSize/2],
		[ cubeSize/2,-cubeSize/2,cubeSize/2],
		[ cubeSize/2, cubeSize/2,cubeSize/2],

		//BACK
		[cubeSize/2, cubeSize/2,-cubeSize/2],
		[cubeSize/2,-cubeSize/2,-cubeSize/2],
		[-cubeSize/2,-cubeSize/2,-cubeSize/2],
		[-cubeSize/2, cubeSize/2,-cubeSize/2],

		//UP
		[ cubeSize/2, cubeSize/2, cubeSize/2],
		[ cubeSize/2, cubeSize/2,-cubeSize/2],
		[-cubeSize/2, cubeSize/2,-cubeSize/2],
		[-cubeSize/2, cubeSize/2, cubeSize/2],

		//DOWN
		[-cubeSize/2,-cubeSize/2, cubeSize/2],
		[-cubeSize/2,-cubeSize/2,-cubeSize/2],
		[ cubeSize/2,-cubeSize/2,-cubeSize/2],
		[ cubeSize/2,-cubeSize/2, cubeSize/2],

		//RIGHT
		[ cubeSize/2, cubeSize/2, cubeSize/2],
		[ cubeSize/2,-cubeSize/2, cubeSize/2],
		[ cubeSize/2,-cubeSize/2,-cubeSize/2],
		[ cubeSize/2, cubeSize/2,-cubeSize/2],

		//LEFT
		[-cubeSize/2, cubeSize/2,-cubeSize/2],
		[-cubeSize/2,-cubeSize/2,-cubeSize/2],
		[-cubeSize/2,-cubeSize/2, cubeSize/2],
		[-cubeSize/2, cubeSize/2, cubeSize/2]
	)	
	
	
	for(var i = 0; i < varray.length; i+=4)
		earray.push(i,i+1,i+2,i+2,i+3,i);
	
	var obj = createObject(varray,earray,cubeColor,cubePos)
	objects.push(obj)
}

function createSphere(radius,color,pos)
{
	var varray = []
	var earray = []

	var e = 0
	var rp = 3
	
	function subdivideTriangle(p1,p2,p3,n)
	{
	  if(n ==  0)
	  {
		var e1,e2,e3
		if(varray.indexOf(p1) == -1)
		{
			varray.push(p1)
		}
		if(varray.indexOf(p2) == -1)
		{
			varray.push(p2)
		}
		if(varray.indexOf(p3) == -1)
		{
			varray.push(p3)
		}
		earray.push(varray.indexOf(p1),varray.indexOf(p2),varray.indexOf(p3))
		return;
	  }
	  var m12 = mix(p1,p2,0.5);
	  var m23 = mix(p2,p3,0.5);
	  var m31 = mix(p3,p1,0.5);
	  n -= 1;
	  subdivideTriangle(m12,p2,m23,n);
	  subdivideTriangle(p1,m12,m31,n);
	  subdivideTriangle(m12,m23,m31,n);
	  subdivideTriangle(m31,m23,p3,n);
	}

	subdivideTriangle([-1,0, 1],[0, 1,0],[ 1,0, 1],rp)
	subdivideTriangle([ 1,0, 1],[0, 1,0],[ 1,0,-1],rp)
	subdivideTriangle([ 1,0,-1],[0, 1,0],[-1,0,-1],rp)
	subdivideTriangle([-1,0,-1],[0, 1,0],[-1,0, 1],rp)
	subdivideTriangle([-1,0, 1],[0,-1,0],[ 1,0, 1],rp)
	subdivideTriangle([ 1,0, 1],[0,-1,0],[ 1,0,-1],rp)
	subdivideTriangle([ 1,0,-1],[0,-1,0],[-1,0,-1],rp)
	subdivideTriangle([-1,0,-1],[0,-1,0],[-1,0, 1],rp)

	for (var i = 0, len = varray.length; i < len; i++) 
		varray[i] = mult(normalize(varray[i]),[radius,radius,radius])			

	var obj = createObject(varray,earray,color,pos)
	objects.push(obj)
}

function createCylinder(slices,color,pos)
{

	var varray = []
	var earray = []
	
	var circle1 = []
	var circle2 = []

	circle1.push([0,1,0])
	for(var i = 0; i <= 2*Math.PI; i += (2*Math.PI/slices) )
		circle1.push([Math.cos(i),1,Math.sin(i)])
	circle1.push([Math.cos(0),1,Math.sin(0)])

	circle2.push([0,-1,0])
	for(var i = 0; i <= 2*Math.PI; i += 2*Math.PI/slices )
		circle2.push([Math.cos(i),-1,Math.sin(i)])
	circle2.push([Math.cos(0),-1,Math.sin(0)])
	
	varray = varray.concat(circle1,circle2)	
	for (var i = 0, len = varray.length; i < len; i++) {
		earray.push(i)
	}
	
	for(var i = 0; i < slices; i++)
	{
		earray.push(earray[1+i])
		earray.push(earray[circle1.length+1+i])
		earray.push(earray[circle1.length+2+i])

		earray.push(earray[circle1.length+2+i])
		earray.push(earray[2+i])
		earray.push(earray[1+i])
	}

	var obj = createObject(varray,earray,color,pos)
	obj.fanSize = circle1.length 
	obj.render = function()
	{
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
			for(var i = 0; i < this.size ; i += 3)
			gl.drawElements(gl.LINE_LOOP,3,gl.UNSIGNED_SHORT,i*2)
				//TODO desenhar elementos com wireframe
		}
		else
		{
			gl.drawElements(gl.TRIANGLE_FAN,this.fanSize,gl.UNSIGNED_SHORT,0)
			gl.drawElements(gl.TRIANGLE_FAN,this.fanSize,gl.UNSIGNED_SHORT,this.fanSize*2)
			gl.drawElements(gl.TRIANGLES,this.fanSize*5,gl.UNSIGNED_SHORT,this.fanSize*2*2)
		}
	}
	objects.push(obj)
}

