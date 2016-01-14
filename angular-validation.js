angular.module('Validation', [
  function() {
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
])