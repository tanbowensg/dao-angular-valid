angular.module('daoValidAngular')
.directive('daoValidOld',['DaoValidRules',
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

.directive('daoValid', ['DaoValidRules',function(DaoValidRules) {
  var validate = ValidateFactory()

  function ValidateFactory() {
    var obj = {}

    window.theresult=obj.result={
      valid:true,
      msg:{}
    }

    obj.asyncValidate = function(data,validator,success,fail){
      window.strange=obj.result
      validator.validate(
        data.value,
        function(){
          //success callback
          if (obj.result.valid===true&&success) {
            success(obj.result)
          }
        },
        function(){
          obj.result.valid=false
          obj.result.msg[data.key] = data.name + validator.msg

          //fail callback
          if (fail) {
            fail(obj.result)
          }
        })
    }

    obj.runCallBack = function(success,fail){
      if(success&&obj.result.valid===true){
        success(obj.result)
      } else if (fail&&obj.result.valid===false){
        fail(obj.result)
      }
    }
    
    obj.validate = function(data,success,fail) {
      var validator, i, j
      obj.result.valid=true

      for (i = 0; i < data.length; i++) {

        for (j = data[i].validators.length - 1; j >= 0; j--) {

          try {
            validator = DaoValidRules[data[i].validators[j]]
          } catch (e) {
            console.warn('no validator called' + data[i].validators[j])
            return false
          }
          //异步验证，如果发现这个是异步的话，那这个验证就不参与验证队列，而是单独运行，直到验证完毕以后，再单独执行一次回调
          //但是要保证这个异步验证的结果不会覆盖掉其他同步验证的result和msg
          //
          if(validator.async===true){
            obj.asyncValidate(data[i],validator,success,fail)
            continue
          }

          //同步验证
          if (validator.validate(data[i].value)) {
            obj.result.msg[data[i].key]=""
          } else {
            obj.result.valid = false
            obj.result.msg[data[i].key]=data[i].name + DaoValidRules[data[i].validators[j]].msg
            break
          }
        }
      }

      obj.runCallBack(success,fail)
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
      alert.className = "text-danger"

      $scope.valid = false

      $scope.$watch("value", function() {
        validate([{
            name: $scope.name,
            key: "key",
            value: $scope.value,
            validators: $scope.rule.split(',')
          }], function(res) {
            try {
              parent.removeChild(alert)
            } catch (e) {}
            $scope.valid = true
          }, function(rej) {
            if (ele[0].className.indexOf("ng-dirty") !== -1) {
              $scope.valid = false
              alert.innerHTML = rej.msg.key
              parent.appendChild(alert)
            }
          })
        })
      }
    };
}])
