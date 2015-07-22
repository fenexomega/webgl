var color = vec3(0.5,0.5,0.5)
var maxLines = 2000000
var gl;
var points;
var programNbr;
var numTriangles = 1;
var vertices 
var angle = 0.0;//1.54;
var maxSubdivisions;
var triangleSize = 0.5;
var canvas;
var figure = 0;
var wireFrame = false;
var gasket = false;


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
	var result = [(p1[0]+p2[0])/2,(p1[1]+p2[1])/2];
	return result;
};

function addTriangle(p1,p2,p3)
{
	vertices.push(p1);
	vertices.push(p2);
	vertices.push(p3);
};

function addSquare(p1,p2,p3,p4)
{
	addTriangle(p1,p2,p3);
	addTriangle(p1,p4,p3);
}

function setCenter(c)
{
	var ucenter = gl.getUniformLocation(programNbr,"center"); 
	gl.uniform2f(ucenter,c[0],c[1]);

}

function subdivideTriangle(p1,p2,p3,n)
{
  if(n ==  0)
  {
    addTriangle(p1,p2,p3);
    return;
  }
  var m12 = middleBetween(p1,p2);
  var m23 = middleBetween(p2,p3);
  var m31 = middleBetween(p3,p1);
  n -= 1;
  subdivideTriangle(m12,p2,m23,n);
  subdivideTriangle(p1,m12,m31,n);
  if(!gasket)
	  subdivideTriangle(m12,m23,m31,n);
  subdivideTriangle(m31,m23,p3,n);
};

function renderTriangles(n)
{

	vertices = []
	var vertice =[[-0.5,-0.35],[0.5,-0.35],[0.0,0.65]]

	maxSubdivisions = n;
    //  Configure WebGL


    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, maxLines*8, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( programNbr, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

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
    gl.viewport( 0, 0, canvas.width, canvas.height );
	canDraw = false
	renderTriangles(0);
	canvas.addEventListener("mousedown",function(event){
		canDraw = true
	})
	
	canvas.addEventListener("mouseup",function(event){
		canDraw = false
	})
	canvas.addEventListener("mousemove",function(event){
		if(!canDraw)
			return
		var t = [2*event.clientX/canvas.width-1,
				1-(2*event.clientY/canvas.height)]
		vertices.push(t);
		gl.bufferSubData(gl.ARRAY_BUFFER,(vertices.length-1)*8,flatten(t))
		render()
	})
};



function render() {
    gl.clearColor( color[0], color[1], color[2], 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.LINE_STRIP, 0, vertices.length);
}
