
var lights = []
var lightTypes = {
	DIRECTIONAL: 0,
	POINT: 1,
	SPOT: 2
}

var structAttribs = [
	"type",
	"position",
	"ambientStr",
	"specularStr",
	"color"

	
]


function createAmbientLight(v3Direction,fAmbientStr,fSpecularStr,v3Color)
{
	return createLight(lightTypes.DIRECTIONAL,v3Direction,
			fAmbientStr,fSpecularStr,v3Color)
}

// x = createAmbientLight([0,1,0],0.3,0.6,[1,1,1])

function createLight(iType, v3Position,fAmbientStr,fSpecularStr,v3Color)
{
	uAmtOfLights = gl.getUniformLocation(program,"amtOfLights")
	var light = {
		type: iType,
		position: v3Position,
		ambientStr: fAmbientStr,
		specularStr: fSpecularStr,
		color: v3Color,
		index: lights.length,
		update: function(){
			this.index = lights.indexOf(this)
			for(var i = 0; i < structAttribs.length; ++i)
			{
				var attrib = structAttribs[i]
				this.uniformIndex = gl.getUniformLocation(program,
						"Lights["+this.index+"]."+attrib)
				
				if(Array.isArray(light[attrib]))
				{
					gl.uniform3fv(this.uniformIndex,flatten(this[attrib]))
				}
				else
				{
					if(light[attrib] != undefined)
						gl.uniform1f(this.uniformIndex,this[attrib]);
				}

			}
			
		}
	}	
	lights.push(light)
	gl.uniform1i(uAmtOfLights,lights.length)
	light.update()
	return light
	
}





