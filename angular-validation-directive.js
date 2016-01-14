angular.module('myapp')
.directive('myValid', [ function(){
  var validation=validFactory()

  function validFactory() {
    var obj={}
    // simple domain pattern
    obj.strategy = {}
    obj.strategy.domainPattern = "/(^(?:\w+\.)+(?:[\w\/]+)$)/"

    obj.strategy.matchNotEmpty = {
      msg: "不能为空",
      validate: function(str) {
        return str !== undefined && str.trim() !== ''
      }
    }

    obj.strategy.matchIPv4 = {
      msg: "必须是IPv4",
      validate: function(str) {
        var ipv4Regex = new RegExp("^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")
        return ipv4Regex.test(str)
      }
    }

    obj.strategy.onlyA1_ = {
      msg: "只能包含中文、英文、数字、下划线",
      validate: function(str) {
        var regex = new RegExp("^[\u4E00-\u9FA5A-Za-z0-9_]+$")
        return regex.test(str)
      }
    }

    /**
     * @param  {[str]}
     * @param  {[array]} 验证方法名的数组
     * @return {[bool]}
     */
    
    obj.validate=function(data) {
      return new Promise(function(resolve,reject){
        console.log("promise")
        var result = true
        var validator,i,j
        var msg = {}
        console.log("data",data)
        for (i = 0; i < data.length ; i++) {
          
          for (j = data[i].validators.length - 1; j >= 0; j--) {

            try {
              validator = obj.strategy[data[i].validators[j]].validate
            } catch (e) {
              console.warn('no validator called' + data[i].validators[j])
              return false
            }

            if (validator(data[i].value)) {
              continue
            } else {
              result = false
              msg[data[i].key]=[]
              msg[data[i].key].push(data[i].name + obj.strategy[data[i].validators[j]].msg)
            }
          }
        }

        if (!result) {
          reject({
            result: result,
            msg: msg
          })
        }

        if (result) {
          resolve("valid!")
        }
      })
    }

    return obj.validate
  }

  return {
    // name: '',
    // priority: 1,
    // terminal: true,
    scope: {
      displayName:"@myValidName",
      rule:"@myValidRule",
      value:"=ngModel",
      // valid:"=",
      // typed:"=",
      // invalidMsg:"=",
    },
    // controller: function($scope, $element, $attrs, $transclude) {
    //   console.log("dirscope",$scope)
    //   $scope.$watch("value",function(){
    //     console.log($scope.displayName)
    //     console.log("dirscope",$scope)
    //   })
    // },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    // templateUrl: '',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    link: function($scope, ele, attrs, controller) {
      console.log("watcgdirscope",$scope)

      var html='<span\
        class="text-danger" \
        ng-show="!valid && typed" \
        style="line-height: 31px; margin-left: 10px;"> \
        {{invalidMsg}}\
      </span>'

      $scope.valid=true
      $scope.typed=false
      $scope.invalidMsg=[]

      $scope.$watch("value",function(){
        $scope.typed=false
        console.log($scope.displayName)
        console.log("watchdirscope",$scope)
        validation([{
          name:$scope.displayName,
          key:"key",
          value:$scope.value,
          validators:$scope.rule.split(',')
        }])
        .then(function(res){
          console.log('valid',res)
        },function(rej){
          $scope.valid=false
          $scope.invalidMsg=rej.msg.key[0]
          $(ele).parent().append(html)
        })
      })
    }
  };
}]);