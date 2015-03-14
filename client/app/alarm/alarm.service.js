'use strict';

/**
 
Alaram API 

 # Direction
- Server -> Client

# Namespace
- `/`

# Event
- `alarm`

# Data
- Alarm

## Alarm
- id: String
- type: AlarmType
- group: Group
- user: User
- card: Card
- created_at: Date
- read: Boolean

## AlarmType
- GROUP_UPDATED
- GROUP_REMOVED
-----------------
- CARD_PUBLISHED
- CARD_RESPONDED
- CARD_COMPLETED
-----------------
** not used type 
- MEMBER_REQUESTED
- MEMBER_APPROVED
- MEMBER_DENIED
- MEMBER_INVITED
- MEMBER_BANNED
- MEMBER_LEAVED

## Group
- id: String
- name: String
- has_photo: Boolean
- photo: String

## User
- id: String
- name: String
- has_photo: Boolean
- photo: String

## Card
- id: String
- title: String
- type: CardType

## CardType
- NOTICE
- RATING
- SURVEY
 */

angular.module('sg.app')
  .service('alarm', function (pubsub, socket, card, group, logger) {
    this.initSocketIO = initSocketIO;
    this.disconnectSocketIO = disconnectSocketIO;

    // first time, when login
    // anther time when reload browser
    function initSocketIO() {
      if(!socket) { return; }
      // clear 
      socket.unsyncUpdates('alarm');
      socket.disconnectSocketSession();

      // send 'login' event to server to connect socket.io
      socket.createSocketSession();

      // register handler
      socket.syncUpdates('alarm', _registerHandler);
    }

    // when logout
    function disconnectSocketIO() {
      if(!socket) {return;}
      socket.disconnectSocketSession();
    }

    function _registerHandler(evt, alarm) {
      // for header
      // pubsub.publish('alarm:header', alarm);

      // for CARD - survey, rating, notice
      if(alarm.type === 'CARD_PUBLISHED'
         || alarm.type === 'CARD_RESPONDED'
         || alarm.type === 'CARD_COMPLETED') {

        card.getCard(alarm.card.id).then(function(response) {
          pubsub.publish('alarm:card', {'alarm': alarm, 'card': response.data});
        }, function(error) {
          logger.error('when query card info in alarm, exception is ', error);
        });

      } 
      // for GROUP
      else if(alarm.type === 'GROUP_UPDATED'
         || alarm.type === 'GROUP_REMOVED') {

        group.getGroup(alarm.group.id).then(function(response) {
          pubsub.publish('alarm:group', {'alarm': alarm, 'group': response.data});
        }, function(error) {
          logger.error('when query group info in alarm, exception is ', error);
        });     

      }
    };

  });


