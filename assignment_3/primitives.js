function createFigure(figureId,pos,color,size)
{
	switch(figureId)
	{
		case figures.cube:
			createCube(size,color,pos)
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
