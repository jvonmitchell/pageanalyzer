var a = function () {
 var crypto = require('crypto'),
  htmlparser = require('htmlparser2'),
  spawn = require('child_process').spawn;
  
 var loadedurls = {};
 
 GLOBAL.getItemAttributes = function(url, attributes, callback) {
  var parser = new htmlparser.Parser( {onopentag : function(name, attribs) {
   attribs.tagName = name;
   for( key in attributes ) {
    if( attributes.hasOwnProperty(key) ) {
     if( typeof attributes[key] === 'function' ? !attributes[key](attribs[key]) : attributes[key] !== attribs[key] ) {
      return;
     }
    }
   }
   callback(attribs);
  }}),
   hash = crypto.createHash('md5');
  hash.update(url);
  hash = hash.digest('hex');
  if( loadedurls[hash] ) {
   if( loadedurls[hash].join ) {
    loadedurls[hash] = loadedurls[hash].join('');
   }
   parser.write(loadedurls[hash]);
   parser.end();
  }
  else {
   loadedurls[hash] = [];
   var curl = spawn('curl', [url]);
   curl.stdout.on('data', function(data) {
    loadedurls[hash].push(data);
    parser.write(data);
   });
   curl.on('exit', function(code) {
    parser.end();
   });
  }
 }
}
a();
