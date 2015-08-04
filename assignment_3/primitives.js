function createCube(cubeSize,cubeColor)
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
	
	objects.push(createObject(varray,earray,carray))
			render()
}
