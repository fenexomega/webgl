
var gl;
var points;
var programNbr;
var numTriangles = 1;
var vertices = [];
var color = [];
var angle = 0.0;//1.54;
var maxSubdivisions;
var center = null;
var triangleSize = 0.5;
var canvas;
var figure = 0;

function distance(p1,p2)
{
  return Math.sqrt(Math.pow((p2[0] - p1[0]),2) + Math.pow((p2[1] - p1[1]),2));
};

function subtractArray(arr1,arr2)
{
  if(arr1.length != arr2.length)
    throw "Diferent Lenght of arrays!";
  var result = [];
  for(i = 0; i < arr1.length; ++i)
  {
    result.push(arr1[i] - arr2[i]);
  }
  return result;
};

function sumArray(arr1,arr2)
{
  if(arr1.length != arr2.length)
    throw "Diferent Lenght of arrays!";
  var result = [];
  for(i = 0; i < arr1.length; ++i)
  {
    result.push(arr1[i] + arr2[i]);
  }
  return result;
};

function divideArray(arr,nbr)
{
  var aux = [];
  for(i of arr)
  {
    aux.push(i/nbr);
  }
  return aux;
};

function getVectorFromTo(p1,p2)
{
	var result = [];
	for(i = 0 ; i < p1.length; ++i)
	{
		result.push(p2[i] - p1[i]);
	}
	return result;
};

function twist(p,center)
{
	var x = p[0];
	var  y = p[1];
	d = distance(p,center);
	x = x*Math.cos(d*angle) - y*Math.sin(d*angle);
	y = x*Math.sin(d*angle) + y*Math.cos(d*angle);
	return [x,y];
}

function middleBetween(p1,p2)
{
	var result = [];
	var vector = sumArray(p2,p1);
	vector = divideArray(vector,2);
	result = sumArray(p1,vector);
	return vector;
};

function addTriangle(p1,p2,p3)
{
	// p1 = twist(p1,center);
	// p2 = twist(p2,center);
	// p3 = twist(p3,center);
	vertices = vertices.concat(p1);
	vertices = vertices.concat(p2);
	vertices = vertices.concat(p3);
	for(i = 0; i < 3; ++i)
	 color = color.concat([1,1,1]);
};

function addSquare(p1,p2,p3,p4)
{
	addTriangle(p1,p2,p3);
	addTriangle(p1,p3,p4);
}

function setCenter(c)
{
	var ucenter = gl.getUniformLocation(programNbr,"center"); 
	gl.uniform2f(ucenter,c[0],c[1]);

}

function subdivideTriangle(p1,p2,p3,n)
{
  if(center == null)
  {
	center = middleBetween(middleBetween(p1,p2),middleBetween(p2,p3));
	setCenter(center);
  }
  if(n ==  0)
  {
    addTriangle(p1,p2,p3);
    return;
  }
  var m12 = middleBetween(p1,p2);
  var m23 = middleBetween(p2,p3);
  var m31 = middleBetween(p3,p1);
  subdivideTriangle(m12,p2,m23,n-1);
  subdivideTriangle(p1,m12,m31,n-1);
  // subdivideTriangle(m12,m23,m31,n-1);
  subdivideTriangle(m31,m23,p3,n-1);
};


function subdivideSquare(p1,p2,p3,p4,n)
{

  if(center == null)
  {
	center = middleBetween(middleBetween(p1,p2),middleBetween(p2,p3));
	setCenter(center);
  }
  if(n ==  0)
  {
    addSquare(p1,p2,p3,p4);
    return;
  }
  var a = middleBetween(p1,p2);
  var b = middleBetween(p2,p3);
  var c = middleBetween(p3,p4);
  var d = middleBetween(p4,p1);
  subdivideSquare(p1,a,center,d,n-1);
  subdivideSquare(a,p2,b,center,n-1);
  subdivideSquare(center,b,p3,c,n-1);
  subdivideSquare(d,center,c,p4,n-1);
};

function setTwist(n)
{
	angle = n;
	// TODO send value to vertex shder uniform ANGLE
	var uangle = gl.getUniformLocation(programNbr,"angle");
	gl.uniform1f(uangle,n);
	render();
};

function renderTriangles(n)
{

    // vertices = [-1, -1, 0, 1, 1, -1];
    // colors   = [1,1,1,
    //                 1,1,1,
	//
	//
    //                 1,1,1];
	vertices = [];
	colors   = [];
	maxSubdivisions = n;
	if(figure == 0)
		subdivideTriangle([-triangleSize,-triangleSize],[0,triangleSize],[triangleSize,-triangleSize],n);
	else
		subdivideSquare([-triangleSize,-triangleSize],[-triangleSize,triangleSize],
				[triangleSize,triangleSize],[triangleSize,-triangleSize],n);
    //  Configure WebGL
	//
	//console.log(vertices);

    gl.viewport( 0, 0, canvas.width, canvas.height );


    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( programNbr, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var colorBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation(programNbr, "vColor");

    gl.vertexAttribPointer(vColor,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vColor);

    render();
};

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	programNbr = program;

	renderTriangles(0);

};

function changeFigure(n)
{
	figure = n;
	renderTriangles(maxSubdivisions);
};

function render() {
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length/2);
}
