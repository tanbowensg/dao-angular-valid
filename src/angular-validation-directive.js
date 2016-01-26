.directive('daoValid', ['DaoValidRules', function(DaoValidRules) {
  var validate = ValidateFactory()

  function ValidateFactory() {
    var obj = {}

    obj.result = {
      valid: true,
      msg: {}
    }

    obj.getValidators = function(data) {
      var i
      //分为同步验证函数队列和异步验证函数队列
      obj.validators = []
      obj.aValidators = []

      for (i = 0; i < data.rules.length; i++) {

        try {

          if (DaoValidRules[data.rules[i]].async) {
            obj.aValidators.push(DaoValidRules[data.rules[i]])
          } else {
            obj.validators.push(DaoValidRules[data.rules[i]])
          }

        } catch (e) {

          console.warn('no validator called' + data.rules[i])
          return false

        }

      }
    }

    obj.syncValidate = function(data) {
      //同步的就正常运行
      for (var i = 0; i < obj.validators.length; i++) {

        var validator = obj.validators[i]

        if (validator.validate(data.value)) {
          obj.result.msg[data.key] = ""

        } else {

          obj.result.valid = false
          obj.result.msg[data.key] = data.name + validator.msg

          break
        }

      }

    }

    obj.asyncValidate = function(data, callback) {

      if (obj.aValidators.length === 0) {
        return
      }

      var promise

      for (var i = 0; i < obj.aValidators.length; i++) {

        var aValidator = obj.aValidators[i]

        if (obj.result.valid) {

          if (i === 0) {

            promise = aValidator.validate(data.value)

          } else {

            promise = promise
              .then(function(res) {

                if (res.valid) {
                  return aValidator.validate(res.str)
                } else {
                  return res
                }

              })

          }

          if (i === obj.aValidators.length - 1) {
            promise
              .then(function(res) {

                if (res.valid === false && obj.result.valid) {

                  obj.result.valid = false
                  obj.result.msg[data.key] = data.name + res.msg

                }

                if (callback) {
                  callback()
                }

              })
          }

        }

      }

      return obj.result
    }

    obj.validate = function(data, success, fail) {

      var validator, i, j

      obj.result.valid = true

      obj.getValidators(data)

      obj.syncValidate(data)

      //仅当同步验证通过时，才会继续异步验证
      if (obj.result.valid && obj.aValidators.length > 0) {

        obj.asyncValidate(data, function() {

          if (success && obj.result.valid === true) {
            success(obj.result)
          } else if (fail && obj.result.valid === false) {
            fail(obj.result)
          }

        })

      } else {

        if (success && obj.result.valid === true) {
          success(obj.result)
        } else if (fail && obj.result.valid === false) {
          fail(obj.result)
        }

      }

    }

    obj.runCallBack = function(success, fail) {

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
      //dirty用来判断用户是否输入过。
      var dirty = 0
      alert.className = "text-danger"

      $scope.valid = false

      $scope.$watch("value", function() {
        dirty++
        $scope.valid = false

        validate({
          name: $scope.name,
          key: "key",
          value: $scope.value,
          rules: $scope.rule.split(',')
        }, function(res) {

          try {

            parent.removeChild(alert)

          } catch (e) {}

          $scope.valid = true

        }, function(rej) {

          if (dirty>=2) {

            $scope.valid = false
            alert.innerHTML = rej.msg.key
            parent.appendChild(alert)

          }

        })
      })
    }
  };
}])