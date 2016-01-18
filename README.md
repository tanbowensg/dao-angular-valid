# DaoValid for Angular

A form-validation plugin for angular

#Usage

If you just want to simply show invalid message and toggle submit button, the directive version is enough and convenient. 

If you need add custom success or failure callback function, you can use service version.

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

###Service Version

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

###Custom Rules

Just find obj.rule in source code and add an object to it like this:

	// Validation Rules Here--------------------------------------
	
    obj.rule = {}
    
	obj.rule.notEmpty = {
	  //this is the invalid message
	  msg: " can not be empty.",
	  
	  //validate funtion should return true or false
	  validate: function(str) {
	    return str !== undefined && str.trim() !== ''
	  }
	}
	