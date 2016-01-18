angular.module('daoValidAngular')
.directive('daoValid',['DaoValidRules',
  function(DaoValidRules) {
    var validate = ValidateFactory()

    function ValidateFactory() {
      var obj = {}

      obj.validate = function(data) {
        var result = true
        var validator, i, j
        var msg = {}

        for (i = 0; i < data.length; i++) {

          for (j = data[i].validators.length - 1; j >= 0; j--) {

            try {
              validator = DaoValidRules[data[i].validators[j]].validate
            } catch (e) {
              console.warn('no validator called' + data[i].validators[j])
              return false
            }

            if (validator(data[i].value)) {
              continue
            } else {
              result = false
              msg[data[i].key] = []
              msg[data[i].key].push(data[i].name + DaoValidRules[data[i].validators[j]].msg)
            }
          }
        }

        if (!result) {
          obj.result = {
            valid: result,
            msg: msg
          }
        }

        if (result) {
          obj.result = {
            valid: result,
          }
        }

        return obj
      }

      obj.success = function(success) {
        if (obj.result.valid) {
          if (success) {
            success(obj.result)
          }
        }
        return obj
      }

      obj.fail = function(fail) {
        if (!obj.result.valid) {
          if (fail) {
            fail(obj.result)
          }
        }
        return obj
      }

      return obj.validate
    }

    return {
      scope: {
        name: "@daoValidName",
        rule: "@daoValidRule",
        value: "=ngModel",
        valid: "=daoValidToggle",
      },
      link: function($scope, ele) {
        var parent = ele[0].parentElement
        var alert = document.createElement("span")

        $scope.valid = false

        $scope.$watch("value", function() {
          validate([{
            name: $scope.name,
            key: "key",
            value: $scope.value,
            validators: $scope.rule.split(',')
          }])
          .success(function(res) {
            try{
              parent.removeChild(alert)
            } catch (e){}
            $scope.valid = true
          })
          .fail(function(rej) {
            if (ele[0].className.indexOf("ng-dirty")!==-1) {
              $scope.valid = false
              alert.innerHTML = rej.msg.key[0]
              parent.appendChild(alert)
            }
          })
        })
      }
    };
}])
