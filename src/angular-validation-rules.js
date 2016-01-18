angular.module('myapp')
.factory('DaoValidRules', function() {
  var rules={}
    // Validation Rules Here--------------------------------------
    rules.notEmpty = {
      msg: " can not be empty.",
      validate: function(str) {
        return str !== undefined && str.trim() !== ''
      }
    }

    rules.url = {
      msg:" must be URL.",
      validate: function(str){
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
      msg: " only accept a-b, A-b, 0-9, and '_'.",
      validate: function(str) {
        var regex = new RegExp("^[\u4E00-\u9FA5A-Za-z0-9_]+$")
        return regex.test(str)
      }
    }

  return rules
})