# DaoValid for Angular

An input-validation plugin for Angular.

## Dependency

Angular.

## Compatibility

Unknown. Only tested in Angular 1.3.15 with Chrome.

## Features

- Reusable rules
- Easy to define your own rules
- Support multiple-rule-validation
- Support async-rule-validation


## Install

1. Import "dao-angular-valid.js" to your project.
2. Inject dao-valid to your APP.

		angular.module('yourAPP',["daoValidAngular"])
		
3. Complete!


## Usage


If you just want to simply show invalid message and toggle submit button, the directive version is enough and convenient. 

If you need add custom success or failure callback function, you can use service version(not ready now).

### Directive Version

	<input 
		// The value you want to validate.
        ng-model="ctrl.ip" 
        
        dao-valid
        
        // A boolean value to show whether the value is valid, this should be binded to the param which can disable the submit button.
        dao-valid-toggle="disabled"
        
        // The rules you want to apply on this input. Muutiple rules should be divided by comma.
        dao-valid-rule="notEmpty,ipv4"
        
        // The name which will display in the wrong message.
        dao-valid-name="IP Address"
    >

###Custom Rules

Just modify angular-validation-rules.js. 

And then Run "gulp" to build.

Or just modify 'DaoValidRules' in "dao-angular-valid.js" like this:

	.factory('DaoValidRules', function() {
	
		var rules={}
		
		// Validation Rules Here--------------------------------------
	    rules.notEmpty = {
	    
	      //The wrong message which will display when the input fails to pass the validation.
	      msg: " can not be empty.",
	      
	      //the validate function should return true or false
	      validate: function(str) {
	        return str !== undefined && str.trim() !== ''
	      }
	      
	    }
	}

Async rules are different. They must return a Promise object. Like this: 

	 rules.uniqueName = {
	   msg: " already exists.",
	
	   // Must add an "async" property and set it true to tell the directive this is an async function.
	   async:true,
	   
	   // instead of return true or false, you should pass 2 callbacks, success for valid, fail for invalid.
	   validate: function(str) {
	   
	     var that=this
	 
	     // Must return a Promise
	     return new Promise(function(resolve,reject){
	     
	       //Maybe some xhr here.
	       checkName(str,function(res){
	
	         if(res==='OK'){
	         
	           // If the input passes the validation, you should resolve an object like this.
	           resolve({
	             valid:true,
	             str:str
	           })
	           
	         } else {
	         
	           // If it fails, you also need resolve an object.
	           resolve({
	             valid:false,
	             msg:that.msg
	           })
	           
	         }
	
	       })
	       
	     })
	   }
	 }

###Service Version(currently not ready)

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
