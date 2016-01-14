# angular-validation-service
A form-validation service for angular

#Usage

	Validation([
	    {
	        name:"DisplayName",
	        key:"mydata",
	        value:$scope.mydata,
	        validators:['matchNotEmpty','matchIPv4']
	    },
		{
			name:"DisplayName2",
			key:"mydata2",
			value:$scope.mydata2,
			validators:['matchNotEmpty']
		},
	])
	.then(function(res){
	    //valid callback
	},function(rej){
	    //invalid callback
	})
	
valid callback response:

	"valid"!
	
valid callback response:

	{
		result: false,
		msg:{
			mydata:["can not be empty","must be IPv4"]
			mydata2:["can not be empty"]
		}
	}	
