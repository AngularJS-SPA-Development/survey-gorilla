'use strict';

var should = require('should'),
    Q = require('q'),
    test = localrequire.test(),
    UserService = localrequire.UserService(), //('../user/user.service'),
    GroupService = require('./group.service');

/**
 * Test 항목
 *   exports.create = create;
 *   exports.index = index;
 *   exports.show = show;
 *   exports.update = update;
 *   exports.destroy = destroy;
 */

describe('>> Group Service', function() {

  beforeEach(test.clear);
  after(test.clear);

  describe('create:', function() {
    it('should be able to create a group', function (done) {
      UserService.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'test',
        role: 'user'
      })
      .then(function(user) {
        return Q.all([
          user,
          GroupService.create({
            name: 'Test Group',
            description: 'Test Group Description'
          }, user)
        ]);
      })
      .spread(function(user, group) {
        return Q.all([
          UserService.show(user.id),
          group
        ]);
      })
      .spread(function(user, group) {
        should.exist(group);
        group.id.should.be.an.instanceOf(String).and.not.be.empty;
        group.created_at.should.be.an.instanceOf(Date);
        group.owner.id.should.be.eql(user.id);
        group.members.should.be.an.instanceOf(Array).and.have.lengthOf(1);
        group.members[0].member.id.should.be.eql(user.id);
        group.members[0].role.should.be.eql('OWNER');
        group.should.be.containEql({
          name: 'Test Group',
          description: 'Test Group Description',
          has_photo: false
        });

        user.groups.should.be.an.instanceOf(Array).and.have.lengthOf(1);
        user.groups[0].id.should.be.eql(group.id);

        done();
      })
      .catch(function(err) {
        done(err);
      });
    });
  }); // create

  describe('list:', function() {
    it('should get an empty array when there is no group', function(done) {
      GroupService.index()
      .then(function(groups) {
        should.exist(groups);
        groups.should.be.an.instanceOf(Array).and.have.lengthOf(0);

        done();
      })
      .catch(function(err) {
        done(err);
      });
    });

    it('should be able to list groups', function(done) {
      UserService.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'test',
        role: 'user'
      })
      .then(function(user) {
        return Q.all([
          user,
          GroupService.create({
            name: 'Test Group',
            description: 'Test Group Description'
          }, user)
          .then(function() {
            return GroupService.create({
              name: 'Test Group 2',
              description: 'Test Group Description 2'
            }, user);
          })
          .then(function() {
            return GroupService.index();
          })
        ]);
      })
      .spread(function(user, groups) {
        should.exist(groups);
        groups.should.be.an.instanceOf(Array).and.have.lengthOf(2);

        groups[0].id.should.be.an.instanceOf(String).and.not.be.empty;
        groups[0].created_at.should.be.an.instanceOf(Date);
        groups[0].owner.id.should.be.eql(user.id);
        groups[0].members.should.be.an.instanceOf(Array).and.have.lengthOf(1);
        groups[0].members[0].member.toString().should.be.eql(user.id);
        groups[0].members[0].role.should.be.eql('OWNER');
        groups[0].should.be.containEql({
          name: 'Test Group',
          description: 'Test Group Description',
          has_photo: false
        });
        
        groups[1].id.should.be.an.instanceOf(String).and.not.be.empty;
        groups[1].created_at.should.be.an.instanceOf(Date);
        groups[1].owner.id.should.be.eql(user.id);
        groups[1].members.should.be.an.instanceOf(Array).and.have.lengthOf(1);
        groups[1].members[0].member.toString().should.be.eql(user.id);
        groups[1].members[0].role.should.be.eql('OWNER');
        groups[1].should.be.containEql({
          name: 'Test Group 2',
          description: 'Test Group Description 2',
          has_photo: false
        });

        done();
      })
      .catch(function(err) {
        done(err);
      });
    });
  });

  describe('read:', function() {
    it('should be able to read a group', function(done) {
      UserService.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'test',
        role: 'user'
      })
      .then(function(user) {
        return Q.all([
          user,
          GroupService.create({
            name: 'Test Group',
            description: 'Test Group Description'
          }, user)
          .then(function(group) {
            return GroupService.show(group.id);
          })
        ]);
      })
      .spread(function(user, group) {
        should.exist(group);
        group.id.should.be.an.instanceOf(String).and.not.be.empty;
        group.created_at.should.be.an.instanceOf(Date);
        group.owner.toString().should.be.eql(user.id);
        group.members.should.be.an.instanceOf(Array).and.have.lengthOf(1);
        group.members[0].member.toString().should.be.eql(user.id);
        group.members[0].role.should.be.eql('OWNER');
        group.should.be.containEql({
          name: 'Test Group',
          description: 'Test Group Description',
          has_photo: false
        });

        done();
      })
      .catch(function(err) {
        done(err);
      });
    });

    it('should not be able to read a non-existing group', function(done) {
      GroupService.show('000000000000000000000000')
      .fail(function(err) {
        should.exist(err);
        should.exist(err.message);
        err.code.should.be.eql('GROUP_NOT_FOUND');

        done();
      })
      .catch(function(err) {
        done(err);
      });
    });
  });

  describe('update:', function() {
    it('should be able to update a group', function(done) {
      UserService.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'test',
        role: 'user'
      })
      .then(function(user) {
        return GroupService.create({
          name: 'Test Group',
          description: 'Test Group Description'
        }, user);
      })
      .then(function(group) {
        return GroupService.update(group.id, {
          name: 'New Test Group',
          description: 'New Test Group Description'
        });
      })
      .then(function(group) {
        should.exist(group);
        group.should.be.containEql({
          name: 'New Test Group',
          description: 'New Test Group Description',
          has_photo: false
        });

        done();
      })
      .catch(function(err) {
        done(err);
      });
    });
  });

  describe('delete:', function() {
    it('should be able to delete a group', function(done) {
      UserService.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'test',
        role: 'user'
      })
      .then(function(user) {
        return GroupService.create({
          name: 'Test Group',
          description: 'Test Group Description'
        }, user);
      })
      .then(function(group) {
        return Q.all([group.id, GroupService.destroy(group.id)]);
      })
      .spread(function(groupId, status) {
        status.should.be.eql(204);
        return GroupService.show(groupId);
      })
      .fail(function(err) {
        should.exist(err);
        should.exist(err.message);
        err.code.should.be.eql('GROUP_NOT_FOUND');

        done();
      })
      .catch(function(err) {
        done(err);
      });
    });
  });
});
