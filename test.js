var request = require('supertest');
var app = require('../index.js');
describe('GET /', function() {
 it('respond with hello world', function(done) { //navigate to root and check the the response is "Hi from Abhay"
 request(app).get('/').expect('Hi from Abhay', done);
 });
});
//This is a test file that is used for mocha testing
