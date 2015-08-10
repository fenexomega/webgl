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


	}
}

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
	
	for(var i = 0; i < varray.length; ++i)
		carray.push(cubeColor)
	
	for(var i = 0; i < varray.length; i+=4)
		earray.push(i,i+1,i+2,i+2,i+3,i);
	
	var obj = createObject(varray,earray,carray,cubePos)
	objects.push(obj)
}

function createSphere(radius,color,pos)
{
	var varray = []
	var carray = []
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
			carray.push(color)
		}
		if(varray.indexOf(p2) == -1)
		{
			varray.push(p2)
			carray.push(color)
		}
		if(varray.indexOf(p3) == -1)
		{
			varray.push(p3)
			carray.push(color)
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

	subdivideTriangle([-radius,0, radius],[0, radius,0],[ radius,0, radius],rp)
	subdivideTriangle([ radius,0, radius],[0, radius,0],[ radius,0,-radius],rp)
	subdivideTriangle([ radius,0,-radius],[0, radius,0],[-radius,0,-radius],rp)
	subdivideTriangle([-radius,0,-radius],[0, radius,0],[-radius,0, radius],rp)
	subdivideTriangle([-radius,0, radius],[0,-radius,0],[ radius,0, radius],rp)
	subdivideTriangle([ radius,0, radius],[0,-radius,0],[ radius,0,-radius],rp)
	subdivideTriangle([ radius,0,-radius],[0,-radius,0],[-radius,0,-radius],rp)
	subdivideTriangle([-radius,0,-radius],[0,-radius,0],[-radius,0, radius],rp)

	for (var i = 0, len = varray.length; i < len; i++) 
		varray[i] = mult(normalize(varray[i]),[1/2,1/2,1/2])			

	var obj = createObject(varray,earray,carray,pos)
	objects.push(obj)
}

