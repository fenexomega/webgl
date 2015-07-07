
var gl;
var points;
var numTriangles = 1;
var vertices = [];
var color = [];
var maxSubdivisions = 5;

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

function middleBetween(p1,p2)
{
	var result = [];
	var vector = subtractArray(p2,p1);
	vector = divideArray(vector,2);
	result = sumArray(p1,vector);
	return result;
};

function addTriangle(p1,p2,p3)
{
    vertices = vertices.concat(p1);
    vertices = vertices.concat(p2);
    vertices = vertices.concat(p3);
    for(i = 0; i < 3; ++i)
     color = color.concat([1,1,1]);
};

function subdivideTriangle(p1,p2,p3)
{
  if(distance(p1,p2) <= 1.0/maxSubdivisions)
  {
    addTriangle(p1,p2,p3);
    return;
  }
  var m12 = middleBetween(p1,p2);
  var m23 = middleBetween(p2,p3);
  var m31 = middleBetween(p3,p1);
  subdivideTriangle(m12,p2,m23);
  subdivideTriangle(p1,m12,m31);
  subdivideTriangle(m12,m23,m31);
  subdivideTriangle(m31,m23,p3);
};

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    // vertices = [-1, -1, 0, 1, 1, -1];
    // colors   = [1,1,1,
    //                 1,1,1,
    //                 1,1,1];
    subdivideTriangle([-1.0,-1.0],[0,1],[1.0,-1.0]);
    //  Configure WebGL
	//  
	console.log(vertices);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var colorBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation(program, "vColor");

    gl.vertexAttribPointer(vColor,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vColor);

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length/2);
    // gl.drawElements
}
