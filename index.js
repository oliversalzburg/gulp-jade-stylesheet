var fs      = require( "fs" );
var mkdirp  = require( "mkdirp" );
var path    = require( "path" );
var slash   = require( "slash" );
var through = require( "through2" );

module.exports = function( pugFile, options ) {
	var linkTags = "";
	options      = options || {};
	options.root = options.root || process.cwd();

	var write = function( file, encoding, callback ) {
		if( file.path != "undefined" ) {
			var relativePath   = path.relative( options.root, file.path );
			var normalized     = slash( relativePath );
			var sourceFileName = normalized;
			if( options.transform ) {
				sourceFileName = options.transform( sourceFileName );
			}
			if( options.version ) {
				sourceFileName = sourceFileName + "?v=" + options.version;
			}
			linkTags = linkTags + "link(rel=\"stylesheet\" href=\"" + sourceFileName + "\")" + "\n";
		}
		this.push( file );
		callback();
	};

	var flush = function( callback ) {
		var dirname = path.dirname( pugFile );
		mkdirp( dirname, function( error ) {
			if( !error ) {
				fs.writeFile( pugFile, linkTags, callback );
			}
		} );
	};

	return through.obj( write, flush );
};
