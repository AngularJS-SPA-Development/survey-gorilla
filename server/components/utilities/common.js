'use strict';

var DEFAULT_GROUP_ICON = '/images/icon_group.png';

exports.getGroupPhoto = getGroupPhoto;
exports.getCardPhoto = getCardPhoto;
exports.sortByRole = sortByRole;
exports.validateEmail = validateEmail;

function getGroupPhoto(id, has_photo) {
  return has_photo ? '/api/v1/groups/' + id + '/photo' : DEFAULT_GROUP_ICON;
};

function getCardPhoto(id) {
  return '/api/v1/cards/' + id + '/photo';
};

function sortByRole(o) {
  switch (o.role) {
    case 'OWNER':
      return 1;
    case 'MEMBER':
      return 2;
    case 'GUEST':
      return 3;
    default:
      return 4;
  }
};

function validateEmail(email) {
  return (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i).test(email);
};