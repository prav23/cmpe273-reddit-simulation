const Mocha = require('Mocha');
const mocha = new Mocha();

var chai = require('chai'), chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

it("Should register user successfully", function(done){
    chai.request('http://localhost:3001/api')
    .post('/register')
    .send({ "name":"user","email": "user@gmail.com", "password" : "abcdef", "password2" : "abcdef" })
    .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
    });
})

it("Should log in the user successfully", function(done){
    chai.request('http://localhost:3001/api')
    .post('/login')
    .send({ "email": "user@gmail.com", "password" : "abcdef"})
    .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
    });
})

it("Should Fetch All Users", function(done){
    chai.request("http://localhost:3001/api")
    .get('/users')
    .then((res) => {
        expect(res).to.have.status(200);
        done();
    })
});

it("Should send a message", function(done){
    chai.request("http://localhost:3001/api")
    .post('/message')
    .send({ "receivedBy": "user2@gmail.com", "sentBy" : "user@gmail.com", "message" : "Hi Bob!"})
    .then((res) => {
        expect(res).to.have.status(200);
        done();
    })
});

it("Should get user's communities", function(done){
    chai.request("http://localhost:3001/api")
    .get('/userprofile/community/Bob')
    .then((res) => {
        expect(res).to.have.status(200);
        done();
    })
});

it("Should get number of posts for a community", function(done){
    chai.request("http://localhost:3001/api")
    .get('/communities/dog/numPosts')
    .then((res) => {
        expect(res).to.have.status(200);
        done();
    })
});

it("Should get the most upvoted post for a community", function(done){
    chai.request("http://localhost:3001/api")
    .get('/communities/dog/mostUpvotedPost')
    .then((res) => {
        expect(res).to.have.status(200);
        done();
    })
});

it("Should create a community", function(done){
    chai.request("http://localhost:3001/api")
    .post('/community')
    .send({ "name": "Fun club", "description" : "new community", "createdBy" : "609efa6dd0ad61250c0ec752"})
    .then((res) => {
        expect(res).to.have.status(200);
        done();
    })
});

it("Should get all comments of a post", function(done){
    chai.request("http://localhost:3001/api")
    .get('/comments/609ef7a1a955b125171e379f')
    .then((res) => {
        expect(res).to.have.status(200);
        done();
    })
});

it("Should get user who created maximum number of posts in a community", function(done){
    chai.request("http://localhost:3001/api")
    .get('/communities/cat/mostActiveUser')
    .then((res) => {
        expect(res).to.have.status(200);
        done();
    })
});
