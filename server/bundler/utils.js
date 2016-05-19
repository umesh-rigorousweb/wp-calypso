const endsWith = require( 'lodash/endsWith' ),
	path = require( 'path' );

function getAssets( stats ) {
	var chunks = stats.chunks;

	return chunks.map( function( chunk ) {
		var filename = chunk.files[0];
		return {
			name: chunk.names[0],
			hash: chunk.hash,
			file: filename,
			url: stats.publicPath + filename,
		};
	} );
}

function isDevelopment( env ) {
	return endsWith( env, 'development' );
}

function pathToRegExp( path ) {
	return new RegExp( '^' + path + '(/.*)?$' );
}

module.exports = {
	getAssets,
	isDevelopment,
	pathToRegExp
};
