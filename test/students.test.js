'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const {app} = require('../index');
const Student = require('../students/models');

// const User = require('../models/user');
const {User} = require('../users/models');

const { users } = require('../db/data');
const { TEST_MONGODB_URI, JWT_SECRET, JWT_EXPIRY  } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('SST API - Students', function () {
  let token;
  let user;

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => User.deleteMany());
  });

  beforeEach(function () {
    return  User.insertMany(users)
      .then(([user]) => {
        
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username, expiresIn: JWT_EXPIRY });
      });
  });

  afterEach(function () {
    return User.deleteMany();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/students', function () {

    it('should return the correct number of students', function () {
      const userId = '5c34e501c6435108085f7a15';
      return Promise.all([
        User.findById(userId),
        chai.request(app).get(`/api/students/${userId}`)
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          //   console.log('>><>>',data.students.length);
          expect(res.body.length).to.equal(data.students.length);
        });
    });

    it('should return a list with the correct right fields', function () {
      const userId = '5c34e501c6435108085f7a15';
      return Promise.all([
        User.findById(userId),
        chai.request(app).get(`/api/students/${userId}`)
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(data.students.length);
          res.body.forEach(function (item, i) {
            // console.log(item);
            expect(item).to.be.a('object');
            expect(item).to.include.all.keys('_id', 'goals', 'createdAt', 'updatedAt', 'name', 'notes');
            // expect(item._id).to.equal(data.students[i]._id);
            expect(item.name).to.equal(data.students[i].name);
            expect(item.goals).to.equal(data.students[i].goals);
            expect(new Date(item.createdAt)).to.eql(data.students[i].createdAt);
            expect(new Date(item.updatedAt)).to.eql(data.students[i].updatedAt);
          });
        });
    });

    
    

    // it.only('should catch errors and respond properly', function () {
    //   sandbox.stub(Student.schema.options.toJSON, 'transform').throws('FakeError');
    //   const userId = '5c34e501c6435108085f7a15';
    //   return chai.request(app).get(`/api/students/${userId}`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .then(res => {
    //         console.log(res);
    //       expect(res).to.have.status(500);
    //       expect(res).to.be.json;
    //       expect(res.body).to.be.a('object');
    //       expect(res.body.message).to.equal('Internal Server Error');
    //     });
    // });

  });

 
  describe('POST /api/students', function () {

    it('should create and return a new student when provided valid name and goal', function () {
      const userId = '5c34e501c6435108085f7a15';
      const newStudent = {
        studentName: 'jimmy',
        goals: 'Lorem'
      };
      let res;
      return chai.request(app)
        .post(`/api/students/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(newStudent)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.students).to.be.a('array');
          expect(res.body.students[0]).to.have.all.keys('_id', 'notes', 'name', 'goals', 'createdAt', 'updatedAt');
        });
    });
  });

 
  describe('DELETE /api/students/:id', function () {

    // it.only('should delete an existing student ', function () {
    //   const userId = '5c34e501c6435108085f7a15';
    //   const studnetId = {_id : '5c34e881b0e4ae5e38a0e8a8'};
    //   return chai.request(app).delete(`/api/students/${userId}`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send(studnetId)
    //     .then(res => {
    //       expect(res).to.be.json;
    //     });  
    // });

    it('should respond with a 400 for an invalid id', function () {
      return chai.request(app)
        .delete('/api/students/NOT-A-VALID-ID')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(400);
        //   expect(res.body.message).to.equal('The `id` is not valid');
        });
    });

    

  });

});
