'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash'),
    common = require('../../../components/utilities/common');

var MemberSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  role: {
    type: String,
    enum: ['OWNER', 'MEMBER', 'GUEST']
  }
}, {
  toJSON: {
    transform: function(doc, ret) {
      var member = ret.member;
      delete ret._id;
      delete ret.member;
      ret.id = member.id;
      ret.email = member.email;
      ret.name = member.name;
      return ret;
    }
  }
});

var GroupSchema = new Schema({
  name: String,
  description: String,
  has_photo: {
    type: Boolean,
    default: false
  },
  photo: String,
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  deleted_at: {
    type: Date,
    index: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [MemberSchema],
}, {
  toJSON: {
    virtuals: true,
    getters: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret._id;
      delete ret.photo;
      ret.photo = common.getGroupPhoto(ret.id, ret.has_photo);

      if (doc.populated('owner')) {
        ret.owner.role = 'OWNER';
      } else {
        delete ret.owner;
      }

      if (doc.populated('members.member')) {
        ret.members = _.sortBy(ret.members, common.sortByRole);
        ret.member_count = ret.members.length;
      } else {
        delete ret.members;
      }

      return ret;
    }
  }
});

module.exports = mongoose.model('Group', GroupSchema);