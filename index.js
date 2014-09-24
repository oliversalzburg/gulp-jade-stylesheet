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
			var relativePath = path.relative( options.root, file.path );
			var normalized = slash( relativePath );
			if( options.transform ) {
				normalized = options.transform( normalized );
			}
			linkTags = linkTags + "link(rel=\"stylesheet\" href=\"" + normalized + "\")" + "\n";
		}
		this.push( file );
		callback();
	};

	var flush = function( callback ) {
		var dirname = path.dirname( jadeFile );
		mkdirp( dirname, function( error ) {
			if( !error ) {
				fs.writeFile( jadeFile, linkTags, callback );
			}
		} );
	};

	return through.obj( write, flush );
};
