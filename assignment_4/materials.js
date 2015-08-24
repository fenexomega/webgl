function createMaterial(v3amb, v3dif, v3spe, shininess)
{
	function setOnShader()
	{
			
	}

	return { ambient: v3amb, diffuse: v3dif, specular: v3spe, shininess: shininess }		
}
