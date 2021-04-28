const Mocha = require('Mocha');
const mocha = new Mocha();

var chai = require('chai'), chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

it("Should register user successfully", function(done){
    chai.request('http://localhost:3001')
    .post('/register')
    .send({ "name":"Raja","email": "raja@gmail.com", "password" : "abcdef" })
    .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
    });
})

it("Should log in the user successfully", function(done){
    chai.request('http://localhost:3001')
    .post('/login')
    .send({ "email": "raja@gmail.com", "password" : "abcdef"})
    .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
    });
})

it("Should Fetch Users"), function(done){
    chai.request("http://localhost:3001")
    .get('/api/users')
    .then((res) => {
        expect(res.status).to.equal(200);
        done();
    })
}
