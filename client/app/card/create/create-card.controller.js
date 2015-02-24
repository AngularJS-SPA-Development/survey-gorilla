(function() {
  'use sctrict';

  angular
    .module('surveyGorillaApp')
    .controller('CreateCardCtrl', CreateCardCtrl);

  /* @ngInject */
  function CreateCardCtrl($scope, $modalInstance, params, card, sgAlert) {
    $scope.addOption = addOption;
    $scope.deleteOption = deleteOption;
    $scope.create = create;
    $scope.cancel = cancel;
    _init();

    function _init() {
      $scope.card = {
        group: params.id, // params is group object
        type: 'NOTICE',
        title: '',
        description: '',
        survey: {type: 'MULTIPLE_OBJECTIVE'} // for OBJECTIVE
      };

      // for OBJECTIVE card 
      $scope.options = [
        {comment:''}
      ];
    }

    function addOption(option, idx) {
      // except conditions
      // 1) already add
      // 2) max option 5
      // 3) except ''
      if( (($scope.options.length-1) !== idx)
        || (idx === 4) 
        || !option.comment
      ) return;     

      $scope.options.push({comment: ''});
    }

    function deleteOption(idx) {
      if($scope.options.length ===  1) {
        return;
      }
      $scope.options.splice(idx, 1);
    }

    function create() {
      if($scope.card.type === 'SURVEY') {
        $scope.card.survey.options = _optimizeOptions();
      } else {
        delete $scope.card.survey;
      }

      card
        .create($scope.card)
        .then(function(response) {
          $modalInstance.close(response.data);
        }, function(error) {
          sgAlert.error('create card error', error);
        });
    };

    function _optimizeOptions() {
      // remove '' comment
      var options = [];
      angular.forEach($scope.options, function(option) {
        if(option.comment) {
          options.push(option.comment);
        }
      });
      return options;
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    };
  }

})();