var mq_client = require('../rpc/client');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

module.exports = function(passport) {
    passport.use('afterLogin', new LocalStrategy(function (username, password,category, done) {
        process.nextTick(function () {
            var msg_payload = {username : username, password: password};
            mq_client.make_request('afterLogin_queue',msg_payload, function(err, results){
                 console.log(results);
                if (results.statusCode === 401) {
                    done(null, results);
                }
                else {
                    done(null, username);
                }
            });

        });
    }));
    passport.use('afterAdminLogin', new LocalStrategy(function (username, password, done) {
        process.nextTick(function () {
            var msg_payload = {username : username, password: password};
            mq_client.make_request('farmerLogin_queue',msg_payload, function(err, results){
                console.log(results);
                if (results.statusCode === 401) {
                    done(null, results);
                }
                else {
                    console.log(username);
                    done(null, username);
                }
            });

        });
    }));
};