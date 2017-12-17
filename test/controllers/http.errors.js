var request = require('supertest');
describe('Http base and errors', function () {
  var server;
  beforeEach(function () {
    server = require('../../app');
  });
  afterEach(function () {
    //server.close();
  });
  it('Base /', function testSlash(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
  it('ERROR 404 not found', function testSlash(done) {
    request(server)
      .get('/XXXXXXXXX')
      .expect(404, done);
  });
});
