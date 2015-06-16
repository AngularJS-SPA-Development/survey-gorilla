'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash'),
    errors = localrequire.config('errors'),
    common = localrequire.common();

var ResponseScheme = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comment: String,
  responded_at: {
    type: Date,
    default: Date.now
  },
  rating: {
    rating: Number
  },
  survey: {
    answer: {}
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
      ret.has_photo = member.has_photo;
      ret.photo = common.getUserPhoto(member.id, member.has_photo);
      return ret;
    }
  }
});

var CardSchema = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  type: {
    type: String,
    enum: ['NOTICE', 'RATING', 'SURVEY']
  },
  title: String,
  description: String,
  commentable: {
    type: Boolean,
    default: false
  },
  has_photo: {
    type: Boolean,
    default: false
  },
  photo: String,
  link: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  due_at: {
    type: Date,
    index: true
  },
  completed_at: {
    type: Date,
    index: true
  },
  deleted_at: {
    type: Date,
    index: true
  },
  survey: {
    type: {
      type: String,
      enum: ['SUBJECTIVE', 'NUMERIC', 'SINGLE_OBJECTIVE', 'MULTIPLE_OBJECTIVE']
    },
    options: [String]
  },
  responses: [ResponseScheme]
}, {
  toJSON: {
    virtuals: true,
    getters: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret._id;
      delete ret.owner;
      delete ret.photo;
      if (ret.has_photo) ret.photo = common.getCardPhoto(ret.id);
      if (ret.type !== 'SURVEY') {
        delete ret.survey;
      }
      if (doc.viewer) {
        var isOwner = doc.owner.equals(doc.viewer);
        var isResponder = _.some(doc.responses, function(response) {
          // NOTE if not populated
          // return response.member.equals(doc.viewer);
          return response.member.id === doc.viewer;
        });
        var isCompleted = doc.completed;
        if (isOwner || isResponder || isCompleted) {
          ret.responded = true;
        } else {
          ret.responded = false;
          delete ret.responses;
        }
      }
      return ret;
    }
  }
});

CardSchema
  .virtual('has_link')
  .get(function() {
    return !!this.link;
  });

CardSchema
  .virtual('completed')
  .get(function() {
    return !!this.completed_at;
  });

CardSchema
  .virtual('deleted')
  .get(function() {
    return !!this.deleted_at;
  });

CardSchema
  .pre('save', function(next) {
    if (!this.owner) {
      next(new Error('Owner is required.'));
    } else {
      next();
    }
  })
  .pre('save', function(next) {
    if (!this.group) {
      next(new errors.FieldRequiredError('group'));
    } else {
      next();
    }
  })
  .pre('save', function(next) {
    if (!this.type) {
      next(new errors.FieldRequiredError('type'));
    } else {
      next();
    }
  })
  .pre('save', function(next) {
    if (!common.validatePresenceOf(this.title)) {
      next(new errors.FieldRequiredError('title'));
    } else {
      next();
    }
  })
  .pre('save', function(next) {
    if (this.due_at && this.due_at < Date.now()) {
      next(new errors.FieldInvalidError('due_at', 'The field:due_at is not valid. It is in the past.'));
    } else {
      next();
    }
  })
  .pre('save', function(next) {
    if (this.type === 'SURVEY' && !this.survey) {
      next(new errors.FieldRequiredError('survey'));
    } else {
      next();
    }
  });

module.exports = mongoose.model('Card', CardSchema);
