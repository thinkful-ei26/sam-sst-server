'use strict';

const {app} = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_MONGODB_URI } = require('../config');

const {User} = require('../users/models');

const expect = chai.expect;

chai.use(chaiHttp);

describe('SST API - Users', function () {
  const username = 'exampleUser';
  const password = 'examplePass0';
  const fullname = 'Example User';
  const fullnameb = ' Example User ';
  const usernameb = '';
  const passwordb = '';
  const usernamec = undefined;
  const passwordc  = undefined; 
  const usernamed = 'exampleUser   ';
  const passwordd = 'examplePass   ';
  const usernamee = null;
  const passworde = null;
  const usernamef = 'msgreen';
  const bigasspass = 'qwertyuiojdhlkjsahdflkjasdhflkjashdlfkjashdlkfjahslkdjfhalksjdfhlkasjdfhlkasjdhflkajsdhflkajsdhflkjasdhflkjahsdlfkjahlsdkjfhalskdjfhlaksjdfhlkasjdfhlaksjdfhlkasjdfhlkasjdfhlkasjdfhlkajsdfhlkajsdhflkajsdhflkjasdhfkljasdhflkajsdhflkajsdfhlkajsdfhlaksjdfhlaksjdfhaslkjdfhaslkdjfhaslkdjf';

  before(function () {
    console.log(TEST_MONGODB_URI);
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true, useCreateIndex : true })
      .then(() => User.deleteMany());
  });

  beforeEach(function () {
    return User.createIndexes();
  });

  afterEach(function () {
    return User.deleteMany();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('POST /users', function () {

    it('Should create a new user', function () {
      let res;
      // console.log(app);
      return chai
        .request(app)

        .post('/users')
        .send({ username, password,})
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'username', 'firstName', 'lastName');
          expect(res.body.id).to.exist;
          expect(res.body.username).to.equal(username);
          return User.findOne({ username });
        })
        .then(user => {
          expect(user).to.exist;
          expect(user.id).to.equal(res.body.id);
          return user.validatePassword(password);
        })
        .then(isValid => {
          expect(isValid).to.be.true;
        });
    });

    it('Should reject users with missing username', function () {
      let res;
      return chai.request(app)
        .post('/users')
        .send({usernameb, password})
        .then(result => {
          res = result;
          //   console.log(usernameb + 'ub');
          expect(res).to.have.status(422);
        });
    });

    it('Should reject users with missing password', function () {
      let res;
      return chai.request(app)
        .post('/users')
        .send({username, passwordb})
        .then(result => {
          res = result;
          //   console.log(passwordb + 'pb');
          expect(res).to.have.status(422);
        });
    });
    it('Should reject users with non-string username', function () {
      let res;
      return chai.request(app)
        .post('/users')
        .send({usernamec, password,})
        .then(result => {
          res = result;
          //   console.log(usernamec);
          expect(res).to.have.status(422);
        });
    });
    it('Should reject users with non-string password', function () {
      let res;
      return chai.request(app)
        .post('/users')
        .send({username, passwordc,})
        .then(result => {
          res = result;
          //   console.log(passwordc);
          expect(res).to.have.status(422);
        });
    });
    it('Should reject users with non-trimmed username', function () {
      let res;
      return chai.request(app)
        .post('/users')
        .send({usernamed, password,})
        .then(result => {
          res = result;
          //   console.log(usernamec);
          expect(res).to.have.status(422);
        });
    });
    it('Should reject users with non-trimmed password', function () {
      let res;
      return chai.request(app)
        .post('/users')
        .send({username, passwordd,})
        .then(result => {
          res = result;
          //   console.log(passwordd);
          expect(res).to.have.status(422);
        });
    });
    it('Should reject users with empty username', function () {
      let res;
      return chai.request(app)
        .post('/users')
        .send({usernamee, password,})
        .then(result => {
          res = result;
          //   console.log(usernamec);
          expect(res).to.have.status(422);
        });
    });
    it('Should reject users with password less than 8 characters', function () {
      let res;
      return chai.request(app)
        .post('/users')
        .send({username, passworde,})
        .then(result => {
          res = result;
          expect(res).to.have.status(422);
        });
    });
    it('Should reject users with password greater than 72 characters', function () {
      let res;
      return chai.request(app)
        .post('/users')
        .send({username, bigasspass,})
        .then(result => {
          res = result;  
          expect(res).to.have.status(422);
        });
    });
    it('Should reject users with duplicate username', function () {
      return User.create({
        username: 'msgreen',
        password,
      })
        .then(() => {
        //   let res = {username: 'msgreen'};
          return chai.request(app)
            .post('/users')
            .send({username: 'msgreen', password,})
            .then(result => {
            //   res = result;
              expect(result).to.have.status(422);
            });
        });
    });

  });

});