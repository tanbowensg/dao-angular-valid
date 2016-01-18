angular.module('myapp')
.directive('daoValid', [function() {
  var validate = ValidateFactory()

  function ValidateFactory() {
    var obj = {}
    // Validation Rules Here--------------------------------------
    obj.rule = {}

    obj.rule.notEmpty = {
      msg: " can not be empty.",
      validate: function(str) {
        return str !== undefined && str.trim() !== ''
      }
    }

    obj.rule.ipv4 = {
      msg: " must be IPv4",
      validate: function(str) {
        var ipv4Regex = new RegExp("^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")
        return ipv4Regex.test(str)
      }
    }

    obj.rule.onlyA1_ = {
        msg: " only accept a-b, A-b, 0-9, and '_'.",
        validate: function(str) {
          var regex = new RegExp("^[\u4E00-\u9FA5A-Za-z0-9_]+$")
          return regex.test(str)
        }
      }
      // Validation Rules End----------------------------------------

    obj.validate = function(data) {
      var result = true
      var validator, i, j
      var msg = {}

      for (i = 0; i < data.length; i++) {

        for (j = data[i].validators.length - 1; j >= 0; j--) {

          try {
            validator = obj.rule[data[i].validators[j]].validate
          } catch (e) {
            console.warn('no validator called' + data[i].validators[j])
            return false
          }

          if (validator(data[i].value)) {
            continue
          } else {
            result = false
            msg[data[i].key] = []
            msg[data[i].key].push(data[i].name + obj.rule[data[i].validators[j]].msg)
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
}]);