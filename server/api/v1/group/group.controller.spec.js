'use strict';

var should = require('should'),
    app = localrequire.app(), //('../../../app');
    test = localrequire.test(),
    request = require('supertest');

var token;
var user;
var group;

var apiv = function(route) { return '/api/v1' + route; };

var create = function() {
  it('should be able to create a user', function(done) {
    request(app)
      .post(apiv('/users'))
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'test',
        role: 'user'
      }).expect(201)
      .expect('Content-Type', /json/)
      .expect('Auth-Token', /^.+$/)
      .end(function(err, res) {
        if (err) return done(err);
        should.exist(res.body.data);
        token = res.get('Auth-Token');
        user = res.body.data.id;
        user.should.be.ok;
        done();
      });
  });

  it('should be able to create a group', function(done) {
    request(app)
      .post(apiv('/groups'))
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Test Group',
        description: 'Test Group Description'
      }).expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        should.exist(res.body.data);
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('created_at');
        res.body.data.should.not.have.property('__v');
        res.body.data.should.not.have.property('_id');
        res.body.data.should.be.containEql({
          name: 'Test Group',
          description: 'Test Group Description',
          has_photo: false
        });
        res.body.data.owner.should.be.containEql({
          id: user,
          name: 'Test User',
          email: 'test@test.com',
          has_photo: false,
          role: 'OWNER'
        });
        res.body.data.members.should.have.lengthOf(1);
        res.body.data.members[0].should.be.containEql({
          id: user,
          name: 'Test User',
          email: 'test@test.com',
          has_photo: false,
          role: 'OWNER'
        });
        group = res.body.data.id;

        done();
      });
  });
};

var remove = function() {
  it('should be able to delete the group', function(done) {
    request(app)
      .del(apiv('/groups/' + group))
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err) {
        if (err) return done(err);
        done();
      });
  });

  it('should be able to delete the user', function(done) {
    request(app)
      .del(apiv('/users/' + user))
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err) {
        if (err) return done(err);
        done();
      });
  });
};

// start test 
describe('>> Group APIs', function() {
  after(test.clear);

  describe('POST:', function() {
    before(test.clear);

    create();

    it('should be able to get the user with groups', function(done) {
      request(app)
        .get(apiv('/users/' + user))
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          should.exist(res.body.data);
          res.body.data.should.be.containEql({
            id: user,
            email: 'test@test.com',
            name: 'Test User',
            description: 'Test User Description',
            has_photo: false
          });
          res.body.data.groups.should.have.lengthOf(1);
          res.body.data.groups[0].should.be.containEql({
            id: group,
            name: 'Test Group',
            description: 'Test Group Description',
            has_photo: false,
            member_count: 1,
            role: 'OWNER'
          });
          done();
        });
    });

    remove();
  });

});