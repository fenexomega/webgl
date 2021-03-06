var cubePrototype
var spherePrototype
var cylinderPrototype
var conePrototype
var slices = 32

function calculeNormals(varray)
{
	var narray = []
	for(var i = 0; i < varray.length  ; i+=3)
	{
		var p1 = subtract(varray[i+1],varray[i])
		var p2 = subtract(varray[i+2],varray[i])
		var normal = normalize(cross(p1,p2))
		for(var z = 0; z < 3; ++z)
			narray.push(normal)
	}
	return narray
}


function createFigure(figureId,pos,color,size)
{
	switch(figureId)
	{
		case figures.cube:
		return	createCube(size,color,pos)
			break
		case figures.sphere:
		return	createSphere(size,color,pos)
			break
		case figures.cylinder:
		return	createCylinder(slices,size,color,pos)
			break
		case figures.cone:
		return	createCone(slices,size,color,pos)
			break
			


	}
}
// TODO reuse the vertex & index buffers!
// TODO use the prototype pattern
function createCube(cubeSize,cubeColor,cubePos)
{
	var varray = []
	var carray = []
	var earray = []
	var narray = []

	varray.push(
		//FRONT
		[-cubeSize/2, cubeSize/2,cubeSize/2],
		[-cubeSize/2,-cubeSize/2,cubeSize/2],
		[ cubeSize/2,-cubeSize/2,cubeSize/2],

		[-cubeSize/2, cubeSize/2,cubeSize/2],
		[ cubeSize/2,-cubeSize/2,cubeSize/2],
		[ cubeSize/2, cubeSize/2,cubeSize/2],

		//BACK
		[cubeSize/2, cubeSize/2,-cubeSize/2],
		[cubeSize/2,-cubeSize/2,-cubeSize/2],
		[-cubeSize/2,-cubeSize/2,-cubeSize/2],

		[cubeSize/2, cubeSize/2,-cubeSize/2],
		[-cubeSize/2,-cubeSize/2,-cubeSize/2],
		[-cubeSize/2, cubeSize/2,-cubeSize/2],

		//UP
		[ cubeSize/2, cubeSize/2, cubeSize/2],
		[ cubeSize/2, cubeSize/2,-cubeSize/2],
		[-cubeSize/2, cubeSize/2,-cubeSize/2],

		[ cubeSize/2, cubeSize/2, cubeSize/2],
		[-cubeSize/2, cubeSize/2,-cubeSize/2],
		[-cubeSize/2, cubeSize/2, cubeSize/2],

		//DOWN
		[-cubeSize/2,-cubeSize/2, cubeSize/2],
		[-cubeSize/2,-cubeSize/2,-cubeSize/2],
		[ cubeSize/2,-cubeSize/2,-cubeSize/2],

		[-cubeSize/2,-cubeSize/2, cubeSize/2],
		[ cubeSize/2,-cubeSize/2,-cubeSize/2],
		[ cubeSize/2,-cubeSize/2, cubeSize/2],

		//RIGHT
		[ cubeSize/2, cubeSize/2, cubeSize/2],
		[ cubeSize/2,-cubeSize/2, cubeSize/2],
		[ cubeSize/2,-cubeSize/2,-cubeSize/2],

		[ cubeSize/2, cubeSize/2, cubeSize/2],
		[ cubeSize/2,-cubeSize/2,-cubeSize/2],
		[ cubeSize/2, cubeSize/2,-cubeSize/2],

		//LEFT
		[-cubeSize/2, cubeSize/2,-cubeSize/2],
		[-cubeSize/2,-cubeSize/2,-cubeSize/2],
		[-cubeSize/2,-cubeSize/2, cubeSize/2],

		[-cubeSize/2, cubeSize/2,-cubeSize/2],
		[-cubeSize/2,-cubeSize/2, cubeSize/2],
		[-cubeSize/2, cubeSize/2, cubeSize/2]
	)	

	

	narray = calculeNormals(varray)
	
	for(var i = 0; i < varray.length; i+=4)
		earray.push(i,i+1,i+2,i+2,i+3,i);
	
	
	var obj = createObject(varray,earray,narray,cubeColor,cubePos)
	obj.renderWireframe = function()
	{
		for(var i = 0; i < this.vsize ; i += 4)
			gl.drawArrays(gl.LINE_LOOP,i,4)
	}
	objects.push(obj)

	return obj
}

function createSphere(radius,color,pos)
{
	var varray = []
	var earray = []
	var narray = []

	var e = 0
	var rp = 3
	
	function subdivideTriangle(p1,p2,p3,n)
	{
	  if(n ==  0)
	  {
		var e1,e2,e3
	
			varray.push(p1)
			varray.push(p2)
			varray.push(p3)
		earray.push(e++,e++,e++)
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
	{
		var norm_vec = normalize(varray[i])
		varray[i] = mult(norm_vec,[radius,radius,radius])			
		narray.push(norm_vec)
	}
	var obj = createObject(varray,earray,narray,color,pos)
	objects.push(obj)
	return obj
}

function createCylinder(slices,size,color,pos)
{

	var varray = []
	var earray = []
	var narray = []
	
	var circle1 = []
	var circle2 = []

	circle1.push([0,1,0])
	narray.push([0,1,0])
	for(var i = 0; i <= 2*Math.PI; i += (2*Math.PI/slices) )
	{
		circle1.push([Math.cos(i),1,Math.sin(i)])
		narray.push([0,1,0])
	}
	circle1.push([Math.cos(0),1,Math.sin(0)])
	narray.push([0,1,0])

	circle2.push([0,-1,0])
	narray.push([0,-1,0])
	for(var i = 0; i <= 2*Math.PI; i += 2*Math.PI/slices )
	{
		circle2.push([Math.cos(i),-1,Math.sin(i)])
		narray.push([0,-1,0])
	}
	circle2.push([Math.cos(0),-1,Math.sin(0)])
	narray.push([0,-1,0])
	
	varray = varray.concat(circle1,circle2)	
	for (var i = 0, len = varray.length; i < len; i++) {
		varray[i] = mult(varray[i],[size,size,size])
		earray.push(i)
	}
	
	for(var i = 0; i <= slices; i++)
	{
		varray.push(varray[1+i])
		varray.push(varray[circle1.length+1+i])
		varray.push(varray[circle1.length+2+i])

		varray.push(varray[circle1.length+2+i])
		varray.push(varray[2+i])
		varray.push(varray[1+i])
	}

	var circle_vertices = circle1.length*2
	var	sub_varray = varray.slice(circle_vertices)
	//TODO: a bug is happening here. The normals are
	// inverted. e.g: it should be [0,1,0], but is [0,-1,0]
	var aux = calculeNormals(sub_varray)
	
	narray = narray.concat(aux)

	var obj = createObject(varray,earray,narray,color,pos)
	obj.fanSize = circle1.length 
	obj.renderFull = function()
	{
			gl.drawArrays(gl.TRIANGLE_FAN,0,this.fanSize)
			gl.drawArrays(gl.TRIANGLE_FAN,this.fanSize,this.fanSize)
			gl.drawArrays(gl.TRIANGLES,this.fanSize*2,this.fanSize*6-6)
	}
	obj.renderWireframe = function(){
//		gl.drawElements(gl.LINE_LOOP,(this.fanSize-1.5)*6,gl.UNSIGNED_SHORT,this.fanSize*2*2)

	}
	objects.push(obj)
	return obj
}

function createCone(slices,size,color,pos)
{

	var varray = []
	var earray = []
	var narray = []
	
	var circle1 = []
	var circle2 = []

	circle1.push([0,1,0])

	circle2.push([0,-1,0])
	for(var i = 0; i <= 2*Math.PI; i += 2*Math.PI/slices )
		circle2.push([Math.cos(i),-1,Math.sin(i)])
	circle2.push([Math.cos(0),-1,Math.sin(0)])
	
	varray = varray.concat(circle1,circle2)	
	for (var i = 0, len = varray.length; i < len; i++)
	{
		varray[i] = mult(varray[i],[size,size,size])
		earray.push(i)
	}
	
	for(var i = 0; i <= slices; i++)
	{
		earray.push(earray[0])
		earray.push(earray[1+i])
		earray.push(earray[2+i])

	}

	var obj = createObject(varray,earray,narray,color,pos)
	obj.fanSize = circle2.length 
	obj.renderFull = function()
	{
			gl.drawElements(gl.TRIANGLE_FAN,this.fanSize,gl.UNSIGNED_SHORT,2)
			gl.drawElements(gl.TRIANGLES,(this.fanSize-1)*3,gl.UNSIGNED_SHORT,(this.fanSize+1)*2)
			this.changeColor([0,0,0])
			this.renderWireframe()
	}
	obj.renderWireframe = function(){
		gl.drawElements(gl.LINE_LOOP,(this.fanSize-2)*3,gl.UNSIGNED_SHORT,(this.fanSize+3)*2)
	}
	objects.push(obj)
	return obj
}

