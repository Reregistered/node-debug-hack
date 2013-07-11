/**
 * The purpose of this module is to wrap fork, spawn
 * exec and execFile when we the main process has been
 * launched with the debug flag. The goal is to ensure the
 * forked process starts with a debug port which differs from
 * the other processes debug ports. If we haven't been launched in debug
 * nothing happens.
 */
(function(){

  var debug = {
    cmd:'',
    cmdIdx: -1,
    cmdPort: ''
  };

  initDebug(debug);
  if (debug.cmdIdx === -1){
    return;
  }

  var idx = 0;
  var cp =  require('child_process');
  var cluster = require('cluster');

  var fnToWrap = [
    {obj:cp,fn:'fork'},
    {obj:cp,fn:'spawn'},
    {obj:cp,fn:'exec'},
    {obj:cp,fn:'execFile'},
    {obj:cluster,fn:'fork'}];

  for (var itr = 0 ; itr < fnToWrap.length ; itr++){

    var scope = fnToWrap[itr];
    var tempFn = scope.obj[scope.fn];
    scope.obj[scope.fn] = function(){
      setDebugNextPort();
      return tempFn.apply(this, arguments);
    }
  }

  var setDebugNextPort = function(){
    process.execArgv[debug.cmdIdx] = debug.cmd + '=' + (debug.cmdPort + (++idx))
  }

})();

function initDebug (debugParam){

  debugParam.cmdIdx = -1;

  for (var itr = 0 ; itr < process.execArgv.length ; ++itr){

    if (process.execArgv[itr].indexOf('--debug') === 0){

      var dbgCmd = process.execArgv[itr];

      debugParam.cmd = dbgCmd.substring(0, dbgCmd.indexOf('='));
      debugParam.cmdPort = Number(dbgCmd.substring(dbgCmd.indexOf('=')+1));
      debugParam.cmdIdx = itr;

    }
  }

  return debugParam;
}

module.exports = undefined;