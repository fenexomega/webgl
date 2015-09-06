var numChecks = 16;


function createTextureChessboard(texSize)
{
	var image = new Uint8Array(4*texSize*texSize)
	for ( var i = 0; i < texSize; i++ ) {
	for ( var j = 0; j <texSize; j++ ) {
		var patchx = Math.floor(i/(texSize/numChecks));
		var patchy = Math.floor(j/(texSize/numChecks));
		if(patchx%2 ^ patchy%2)
			c = 255;
		else
			c = 0;
		//c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
		image[4*i*texSize+4*j] = c;
		image[4*i*texSize+4*j+1] = c;
		image[4*i*texSize+4*j+2] = c;
		image[4*i*texSize+4*j+3] = 255;
        }
    }
	return createTexture(image,texSize)

}

function createTexture(imageData,texSize)
{
	var texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	return texture
}


