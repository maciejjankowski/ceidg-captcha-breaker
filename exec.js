var fs = require('fs');
var async = require('async');

var tmpDir = "tmp/tmp-";

exports.run = function _run(cId, sid, cb){
  var parallelCb = function _parallelCb() {
    function _processReaddir(err, files ) {

      async.map(
          files,
          function ( file, next ) {
            fs.stat( tmpDir + cId + '/' + file, function _fsStatCb( err, results ) {

              if ( err !== null ) {
                console.error( 'stat error: ', error );
                next(err);
              } else {

                next(null, results.size);
              }
            } );// stat
          },
          function _mapFinished(err, results) {
            if (err)
              throw err;
            cb(results);
          }
      );// map
    } // processReaddir

    fs.readdir( tmpDir + cId, _processReaddir );
  }; // parallelCb;

  var cmd = ( (process.env.os == 'Windows_NT') ? 'rcn.bat' : './rcn' ) + ' ' + cId + " " + sid;

  async.times(3, function(n, next){

    function _execCb(error, stdout, stdin) {
      if ( error !== null ) {
        console.error( 'exec error: ' + error );
        next(error);
      } else {
        next(null)
      }
    } // execCb
    var r  = require('child_process').exec(cmd  + " " + n, _execCb);
  },
      parallelCb
  ); // times
};

// command-line
if (process.argv[3] && process.argv[2]){
  exports.run(process.argv[3], process.argv[2], function(result){
    console.log(result);
  });
}
