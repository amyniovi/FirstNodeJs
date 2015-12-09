/*
Server side of application
*/

var http = require('http'),
    sys = require('util'),
    nodeStatic = require('node-static/lib/node-static'),
    faye = require('faye/node/faye-node'),
    url = require('url');

//Anything assigned to "this" or "self" can be called from outside the
//class
//Variables declared with var or bare functions can only be called within
//instances of the class
function LiveStats(options) {

    if (!(this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
    }
    //ensures we dont touch global stuff
    var self = this;

    self.settings = {
        port: options.port,
        geoipServer: {
            hostname: options.geoipServer.hostname,
            port: options.geoipServer.port || 80
        }
    };

    self.init();
};
//Alternatively to assigning to prototype, we could create a private
// function init(){}; inside the LiveStats function. 
LiveStats.prototype.init = function () {
    var self = this;
    self.bayeux = self.createBayeuxServer();

    self.httpServer = self.createHTTPServer();
    self.bayeux.attach(self.httpServer);
    self.httpServer.listen(self.settings.port);
    sys.log('Server started on PORT ' + self.settings.port);

};

LiveStats.prototype.createHTTPServer = function () {
    var self = this;
    var server = http.createServer(
    function (request, response) {

        var file = new nodeStatic.Server('./public', {
            cache: false
        });


        request.addListener('end', function () {
            var location = url.parse(request.url, true),
                params = (location.query || request.headers);
            switch (request.method) {
                case 'GET':
                    switch (location.pathname) {
                        case '/config.json':
                            //send json
                            response.writeHead(200, {
                                'Content-Type': 'application/x-javascript'
                            });
                            var jsonString = JSON.stringify(
                                {
                                    port: self.settings.port
                                });
                            break;
                        case '/stat':
                            //record visit
                            self.ipToPosition()
                            break;
                        default:
                            file.serve(request, response);
                    }
            }
        });

       
    });

};

LiveStats.prototype.ipToPosition = function (ip, callback) {
    var self = this;
    var client = http.createClient(self.settings.geoipServer.port,
                                    self.settings.geoipServer.hostname);
    //more stuff to do here
};



LiveStats.prototype.createBayeuxServer = function () {
    var self = this;

    var bayeux = new faye.NodeAdapter(
        {
            mount: '/faye',
            timeout: 45
        }
        );


};

exports = LiveStats;

console.log('we are executing hello world');

