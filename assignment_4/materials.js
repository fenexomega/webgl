/* NOT USED */
var Materials = []

function createMaterial(v3amb, v3dif, v3spe, shininess)
{

	var obj = { 
		ambient: v3amb,
		difuse: v3dif,
		specular: v3spe,
		shininess: shininess,
		sendToShader: function ()	{
			var ambient = gl.getUniformLocation(program,"Material.ambient")		
			var difuse = gl.getUniformLocation(program,"Material.difuse")		
			var specular = gl.getUniformLocation(program,"Material.specular")		
			var shininess = gl.getUniformLocation(program,"Material.shininess")		

			gl.uniform3f(ambient,this.ambient[0],this.ambient[1],this.ambient[2])
			gl.uniform3f(difuse,this.difuse[0],this.difuse[1],this.difuse[2])
			gl.uniform3f(specular,this.specular[0],this.specular[1],this.specular[2])
			gl.uniform1f(shininess,this.shininess)

		}
	}		

	Materials.push(obj)
	return obj
}

// http://devernay.free.fr/cours/opengl/materials.html
//created Materials
//GOLD
createMaterial([0.24725,0.1995,0.0745],
		[0.75164,0.60648,0.22648],
		[0.628281,0.555802,0.366065],51.2)
//Silver
createMaterial([ 	0.19225 ,0.19225 ,0.19225],
		[0.50754 ,0.50754 ,0.50754],
		[0.508273 ,0.508273 ,0.508273],
		0.4*256)
//Emerald
createMaterial([0.0215 ,0.1745 ,0.0215],
		[0.07568 ,0.61424 ,0.07568 ],[0.633 ,0.727811 ,0.633] ,0.6*256)
	//Jade
createMaterial([0.135 ,0.2225 ,0.1575],
		[	0.54,	0.89 ,0.63  ],[0.316228, 0.316228 ,0.316228 ],0.1*256)
	//Obsidian
createMaterial([0.05375 ,0.05 ,0.06625] ,

		[0.18275 ,0.17 ,0.22525 ],[0.332741,	0.328634 ,0.346435],	0.3*256)
	//Pearl
createMaterial([	0.25 ,0.20725 ,0.20725] ,
		[1,	0.829 ,0.829 ],[0.296648,	0.296648 ,0.296648],	0.088*256)
	//Ruby
createMaterial([	0.1745 ,0.01175,	0.01175],
		[	0.61424 ,0.04136 ,0.04136], [	0.727811,	0.626959 ,	0.626959 ]	,0.6*256)
