'use strict';

var _ = require('lodash'),
    Q = require('q'),
    Card = localrequire.Card(),
    Group = localrequire.Group(),
    errors = localrequire.errors(),
    mongoose = require('mongoose');
    //alarm = require('./alarm');

exports.list = list;
exports.preload = preload;
exports.read = read;
exports.create = create;
exports.update = update;
exports.respond = respond;
exports.complete = complete;


var shouldBeCompleted = function(card) {
  return card.due_at && !card.completed && card.due_at <= new Date();
};

function list(options, user) {
  if (!options) options = {};
  if (!options.sort) options.sort = {};
  if (!options.sort.by) options.sort.by = 'created_at';
  if (!options.limit) options.limit = 10;
  if (options.limit < 1) options.limit = 1;
  if (options.limit > 100) options.limit = 100;

  var query = Card.find();
  query.where('deleted_at').exists(false);

  if (options.title) query.where('title').equals(new RegExp(options.title, 'i'));
  if (options.groups) query.where('group').in(options.groups);
  // NOTE use this if created card should be not included
  // if (options.users) query.where('responses.member').in(options.users);
  if (options.users) query.or(
    [
      { 'responses.member': { $in: options.users } },
      { 'owner': { $in: options.users } }
    ]
  );
  if (options.types) query.where('type').in(options.types);
  if (options.completed !== undefined) query.where('completed_at').exists(options.completed);

  var sort = options.sort;
  query.where(sort.by);
  if (sort.lt) query.lt(new Date(sort.lt));
  if (sort.lte) query.lte(new Date(sort.lte));
  if (sort.gt) query.gt(new Date(sort.gt));
  if (sort.gte) query.gte(new Date(sort.gte));
  query.sort((sort.desc ? '-' : '') + sort.by);
  query.limit(options.limit);

  var deferred = Q.defer();

  query.populate('group responses.member').exec(function(err, cards) {
    if (err) return deferred.reject(err);

    // Adds 'viewer' property for json rendering (for all cards)
    _.forEach(cards, function(card) {
      card.viewer = user.id;
    });

    deferred.resolve(cards);
  });

  return deferred.promise;
}

function preload(id) {
  var deferred = Q.defer();

  Card.findOne({ _id: id, deleted_at: { $exists: false } }).exec(function(err, card) {
    if (err) {
      if (err.name === 'CastError' && err.type === 'ObjectId')
        return deferred.reject(new errors.CardNotFoundError(id));
      else return deferred.reject(err);
    }

    if (!card) return deferred.reject(new errors.CardNotFoundError(id));

    if (shouldBeCompleted(card)) {
      exports.complete(card, true)
        .then(function(card) {
          deferred.resolve(card);
        }, function(err) {
          deferred.reject(err);
        });
    } else {
      deferred.resolve(card);
    }
  });

  return deferred.promise;
}

function read(id, user) {
  var deferred = Q.defer();

  Card.findOne({ _id: id, deleted_at: { $exists: false } })
  .populate('group responses.member').exec(function(err, card) {
    if (err) {
      if (err.name === 'CastError' && err.type === 'ObjectId')
        return deferred.reject(new errors.CardNotFoundError(id));
      else return deferred.reject(err);
    }

    if (!card) return deferred.reject(new errors.CardNotFoundError(id));

    // Adds 'viewer' property for json rendering
    card.viewer = user.id;

    if (shouldBeCompleted(card)) {
      exports.complete(card, true)
        .then(function(card) {
          deferred.resolve(card);
        }, function(err) {
          deferred.reject(err);
        });
    } else {
      deferred.resolve(card);
    }
  });

  return deferred.promise;
}

function create(contents, user) {
  var invalid = _.findKey(contents, function(value, key) {
    return !_.some(['group', 'type', 'title', 'description', 'commentable', 'link', 'due_at', 'survey'], function(field) {
      return field === key;
    });
  });

  if (invalid) {
    return Q.try(function() {
      throw new errors.FieldInvalidError(invalid);
    });
  }

  var deferred = Q.defer();

  contents.owner = user.id;

  new Card(contents).save(function(err, card) {
    if (err) return deferred.reject(err);

    card.populate('group responses.member', function(err, card) {
      if (err) return deferred.reject(err);

      //alarm.cardPublished(card, user);

      // Adds 'viewer' property for json rendering
      card.viewer = user.id;

      deferred.resolve(card);
    });
  });

  return deferred.promise;
}

function respond(card, response, user) {
  if (card.completed) {
    return Q.try(function() {
      throw new errors.CardAlreadyCompletedError(card.id);
    });
  }

  var deferred = Q.defer();

  var res = { member: user.id };
  if (card.commentable) res.comment = response.comment;
  if (card.type === 'RATING') res.rating = response.rating;
  if (card.type === 'SURVEY') res.survey = response.survey;

  Card.update({
    _id: card.id,
    completed_at: { $exists: false },
    owner: { $ne: user.id },
    'responses.member': { $ne: user.id }
  }, {
    $push: {
      responses: res
    }
  }, function(err, n) {
    if (err) return deferred.reject(err);

    if (!n) return deferred.reject(new errors.CardAlreadyRespondedError(card.id));

    card.responses.push(res);

    card.populate('group', function(err, card) {
      if (!err) {
        //alarm.cardResponded(card, user);
      }
    });

    deferred.resolve(card);
  });

  return deferred.promise;
}

function complete(card, auto) {
  var deferred = Q.defer();

  Card.update({
    _id: card.id,
    completed_at: { $exists: false }
  }, {
    completed_at: new Date()
  }, function(err) {
    if (err) return deferred.reject(err);

    if (card.type === 'RATING') {
      var responses = card.responses;
      Group.findOne({ _id: card.group }).exec(function(err, group) {
        if (!err && group) {
          var ratings = group.rating.all;
          _.forEach(responses, function(response) {
            var old = _.find(ratings, function(rating) {
              return rating.member.equals(response.member);
            });
            if (old) {
              old.rating = response.rating.rating;
              old.comment = response.comment;
            } else {
              ratings.push({
                member: response.member,
                rating: response.rating.rating,
                comment: response.comment
              });
            }
          });

          if (ratings.length) {
            var sum = _.reduce(ratings, function(sum, rating) {
              return sum + rating.rating;
            }, 0);
            group.rating.average = sum / ratings.length;
          }

          group.save();
        }
      });
    }

    card.completed_at = new Date();

    card.populate('group', function(err, card) {
      if (!err) {
        //alarm.cardCompleted(card, auto);
      }
    });

    deferred.resolve(card);
  });

  return deferred.promise;
}

function update(card, contents) {
  var invalid = _.findKey(contents, function(value, key) {
    return !_.some(['title', 'description', 'due_at'], function(field) {
      return field === key;
    });
  });

  if (invalid) {
    return Q.try(function() {
      throw new errors.FieldInvalidError(invalid);
    });
  }

  _.forOwn(contents, function(value, key) {
    card[key] = value;
  });

  var deferred = Q.defer();

  card.save(function(err, card) {
    if (err) return deferred.reject(err);

    deferred.resolve(card);
  });

  return deferred.promise;
}

exports.delete = function(card) {
  var deferred = Q.defer();

  card.update({
    deleted_at: new Date()
  }, function(err, card) {
    if (err) return deferred.reject(err);

    deferred.resolve(card);
  });

  return deferred.promise;
}

exports.photo = {
  upload: function(card, image) {
    var deferred = Q.defer();

    card.has_photo = true;
    card.photo = image;

    card.save(function(err, card) {
      if (err) return deferred.reject(err);

      deferred.resolve(card);
    });

    return deferred.promise;
  },

  download: function(card) {
    var deferred = Q.defer();

    var id = card.id;

    Card.findOne({ _id: id }).exec(function(err, card) {
      if (err) {
        if (err.name === 'CastError' && err.type === 'ObjectId')
          return deferred.reject(new errors.CardNotFoundError(id));
        else return deferred.reject(err);
      }

      if (!card) return deferred.reject(new errors.CardNotFoundError(id));

      if (!card.has_photo || !card.photo)
        return deferred.reject(new errors.PhotoNotFoundError(id, 'Photo for card:' + id + ' is not found.'));

      deferred.resolve(card);
    });

    return deferred.promise;
  }
};
