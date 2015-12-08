//console.log can be used in most browsers
//sys.log would only be server side
process.addListener('uncaughtException', function (err, stack) {
    console.log('---------------------');
    console.log('Exception: ' + err);
    console.log(err.stack);
    console.log('---------------------');
   
});

var LiveStats = require('./lib/liveStats');
var port = 8124;

new LiveStats({
    port: port,
    geoipServer: {
        hostname: 'geoip.peepcode.com',
        port:80

    }
});
