# DaoValid for Angular

A form-validation plugin for angular

##Dependency

Angular

##Features

- Easy to use
- Custom and reusable rules
- Validate by multiple rules


##Usage

If you just want to simply show invalid message and toggle submit button, the directive version is enough and convenient. 

If you need add custom success or failure callback function, you can use service version(not ready now).

###Directive Version

	<input 
		//the value you want to check
        ng-model="ctrl.ip" 
        
        dao-valid
        
        //a boolean value to show whether the value is valid, this should be binded to the param which can disables the submit button 
        dao-valid-toggle="disabled"
        
        //mutiple rules should be divided by comma
        dao-valid-rule="notEmpty,ipv4"
        
        //the name which will display in the wrong message
        dao-valid-name="IP Address"
    >

###Custom Rules

Just modify angular-validation-rules.js like this:

	var rules={}

	// Validation Rules Here--------------------------------------
    rules.notEmpty = {
      msg: " can not be empty.",
      
      //the validate function should return true or false
      validate: function(str) {
        return str !== undefined && str.trim() !== ''
      }
    }

Async custom rules are different:

	rules.uniqueName = {
	  msg: "already exists.",
	  
	  // must add an "async" property and set it true to tell the directive this is an async function.
	  async:true,
	  
	  // instead of return true or false, you should pass 2 callbacks, success for valid, fail for invalid.
	  validate: function(str,success,fail) {
	    checkNamePromise(str)
	      .then(function(res){
	        if(res.data==='OK'){
	          success()
	        } else {
	          fail()
	        }
	      })
	  }
	}

###Service Version(not ready)

	Validation([
	    {
	        name:"DisplayName",
	        key:"mydata",
	        value:$scope.mydata,
	        validators:"notEmpty,ipv4"
	    },
		{
			name:"DisplayName2",
			key:"mydata2",
			value:$scope.mydata2,
			validators:"notEmpty,ipv4"
		},
	])
	.success(function(res){
	    //valid callback
	})
	.fail(function(rej){
	    //invalid callback
	})
	
valid callback response:

	"valid"!
	
valid callback response:

	{
		result: false,
		msg:{
			mydata:["DisplayName can not be empty"," DisplayNamemust be IPv4"]
			mydata2:["DisplayName2 can not be empty"]
		}
	}	
