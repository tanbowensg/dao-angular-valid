.factory('DaoValidRules', function() {
  var rules = {}
    // Validation Rules Here--------------------------------------
  rules.notEmpty = {
    msg: " can not be Empty",
    validate: function(str) {
      return str !== undefined && str.trim() !== ''
    }
  }

  rules.url = {
    msg: " must be an URL",
    validate: function(str) {
      var urlRegex = new RegExp("^http\:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$")
      return urlRegex.test(str)
    }
  }

  rules.ipv4 = {
    msg: " must be IPv4",
    validate: function(str) {
      var ipv4Regex = new RegExp("^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")
      return ipv4Regex.test(str)
    }
  }

  rules.onlyA1_ = {
    msg: " only accept a-b, A-B, 0-9 and _.",
    validate: function(str) {
      var regex = new RegExp("^[\u4E00-\u9FA5A-Za-z0-9_]+$")
      return regex.test(str)
    }
  }

  rules.asyncURL = {
    msg: " must be url. (async)",
    async: true,
    validate: function(str) {
      var that = this
      var urlRegex = new RegExp("^http\:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$")

      return new Promise(function(resolve, reject) {

        setTimeout(function() {
          if (urlRegex.test(str)) {
            resolve({
              valid: true,
              str: str
            })
          } else {
            resolve({
              valid: false,
              msg: that.msg
            })
          }

        })

      })
    }
  }

  rules.notOption = {
    msg: " cannot be 12345. (async)",
    async: true,
    validate: function(str, option) {
      var that = this

      return new Promise(function(resolve, reject) {

        setTimeout(function() {
          console.log("额外的参数！",option)
          if (str!==option.text) {
            resolve({
              valid: true,
              str: str
            })
          } else {
            resolve({
              valid: false,
              msg: that.msg
            })
          }

        })

      })
    }
  }
  

  rules.asyncipv4 = {
    msg: " 必须是ipv4 异步版",
    async: true,
    validate: function(str) {
      var that = this
      var ipv4Regex = new RegExp("^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")

      return new Promise(function(resolve, reject) {

        setTimeout(function() {

          if (ipv4Regex.test(str)) {
            resolve({
              valid: true,
              str: str
            })
          } else {
            resolve({
              valid: false,
              msg: that.msg
            })
          }

        })

      })
    }
  }

  return rules
})