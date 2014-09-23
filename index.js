var fs = require( "fs" );
var mkdirp = require( "mkdirp" );
var path = require( "path" );
var slash = require( "slash" );
var through = require( "through2" );

module.exports = function( jadeFile, options ) {
	var linkTags = "";
	options.root = options.root || process.cwd();

	var write = function( file, encoding, callback ) {
		if( file.path != "undefined" ) {
			linkTags = linkTags + "link(rel=\"stylesheet\" href=\"/" + slash( path.relative( options.root, file.path ) ) + "\")" + "\n";
		}
		this.push( file );
		callback();
	};

	var flush = function( callback ) {
		var dirname = path.dirname( jadeFile );
		mkdirp( dirname, function( error ) {
			if( !error) {
				fs.writeFile( jadeFile, linkTags, callback );
			}
		} );
	};

	return through.obj( write, flush );
};
