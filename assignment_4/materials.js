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

			gl.Uniform3f(ambient,this.ambient[0],this.ambient[1],this.ambient[2])
			gl.Uniform3f(difuse,this.difuse[0],this.difuse[1],this.difuse[2])
			gl.Uniform3f(specular,this.specular[0],this.specular[1],this.specular[2])
			gl.Uniform1f(shininess,this.shininess)

		}
	}		

	return obj
}
