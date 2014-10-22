'use strict';

var should = require('should'),
    Q = require('q'),
    User = require('../user/user.model'),
    Group = require('./group.model');

/**
 * Test 항목 
 *   exports.index = index;
 *   exports.show = show;
 *   exports.create = create;
 *   exports.update = update;
 *   exports.destroy = destroy;
 */

describe('create:', function() {
  it('should be able to create a group', function (done) {
      User.create({
        name: 'Test User'
        email: 'test@test.com',
        password: 'test',
        role: 'user'
      })
      .then(function(user) {
        return Q.all([
          user,
          Group.create({
            name: 'Test Group',
            description: 'Test Group Description'
          }, user)
        ]);
      })
      .spread(function(user, group) {
        return Q.all([
          User.read(user.id),
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

        return Q.all([
          User.authenticate('test@test.com', 'test'),
          group
        ]);
      })
      .spread(function(user, group) {
        user.groups.should.be.an.instanceOf(Array).and.have.lengthOf(1);
        user.groups[0].id.should.be.eql(group.id);

        done();
      })
      .catch(function(err) {
        done(err);
      });
    });
});