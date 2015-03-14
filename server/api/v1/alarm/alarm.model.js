'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AlarmSchema = new Schema({
  for: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'GROUP_UPDATED', 'GROUP_REMOVED',
      'CARD_PUBLISHED', 'CARD_RESPONDED', 'CARD_COMPLETED',
      'MEMBER_REQUESTED', 'MEMBER_APPROVED', 'MEMBER_DENIED',
      'MEMBER_BANNED', 'MEMBER_INVITED', 'MEMBER_LEAVED'
    ]
  },
  group: {
    id: Schema.Types.ObjectId,
    name: String,
    has_photo: Boolean,
    photo: String
  },
  user: {
    id: Schema.Types.ObjectId,
    name: String,
    has_photo: Boolean,
    photo: String
  },
  card: {
    id: Schema.Types.ObjectId,
    title: String,
    type: {
      type: String
    }
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: {
    virtuals: true,
    getters: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret._id;
      delete ret.for;
      return ret;
    }
  }
});

AlarmSchema
  .pre('save', function(next) {
    if (!this.for) {
      next(new Error('For is required.'));
    } else {
      next();
    }
  })
  .pre('save', function(next) {
    if (!this.type) {
      next(new Error('Type is required.'));
    } else {
      next();
    }
  });

module.exports = mongoose.model('Alarm', AlarmSchema);
