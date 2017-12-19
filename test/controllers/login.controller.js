var request = require('supertest');
var app = require('../../app');
var faker = require('faker');
  
describe('Login', function () {

    describe('Login fail', function () {
        it('should reject an invalid user with 409 status', function (done) {
            request(app)
            .post('/login')
            .send({
                username: faker.internet.email(),
                password: faker.internet.password()
            })
            .expect(302)
            .end(function (err, res) {
                done(err);
            })
        })
    });
    describe('Login fail', function () {
        it('should reject user because of wrong password', function (done) {
            request(app)
            .post('/login')
            .send({
                username: faker.internet.email(),
                password: faker.internet.password()
            })
            .expect(302)
            .end(function (err, res) {
                done(err);
            })
        })
    });
    describe('Login fail', function () {
        it('should reject user because of wrong username', function (done) {
            request(app)
            .post('/login')
            .send({
                username: faker.internet.email(),
                password: faker.internet.password()
            })
            .expect(302)
            .end(function (err, res) {
                done(err);
            })
        })
    });
    
    describe('Login ok', function () {
        it('should login user ok', function (done) {
            request(app)
            .post('/login')
            .send({
                username: 'admin',
                password: 'admin'
            })
            .expect('location', '/dashboard')
            .end(function (err, res) {
                done(err);
            })
        });
    });
})