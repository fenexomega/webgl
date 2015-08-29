
var lights = []
var lightTypes = {
	DIRECTIONAL: 0,
	POINT: 1,
	SPOT: 2
}

var structAttribs = [
	"active",
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
		active: 1,
		type: iType,
		position: v3Position,
		ambientStr: fAmbientStr,
		specularStr: fSpecularStr,
		color: v3Color,
		index: lights.length,
		rotationAngle: 0,
		update: function(){
			this.rotationAngle++
			this.rotationMatrix = rotate(this.rotationAngle,[0,1,0])
			this.index = lights.indexOf(this)
			var urotationMatrix = gl.getUniformLocation(program,"Lights["+this.index+"].rotationMatrix")
			gl.uniformMatrix4fv(urotationMatrix,false,flatten(this.rotationMatrix))
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
					{
						if(attrib === "active" || attrib === "type")
							gl.uniform1i(this.uniformIndex,this[attrib])
						else
							gl.uniform1f(this.uniformIndex,this[attrib]);
					}
				}

			}
			
		}
	}	
	lights.push(light)
	gl.uniform1i(uAmtOfLights,lights.length)
	light.update()
	return light
	
}





