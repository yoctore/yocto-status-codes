var status = require('../dist');

var successData = { message : 'Yeah !', data : { foo : 'bar' } };
var errorData = { message : 'Bad !', data : { foo : 'bar error' } };
var systemErrorData = { message : 'Very bad !', data : { foo : 'bar system' } };

// To retrieve a success reponse
console.log(status.success(successData));

// To retrieve an error reponse
console.log(status.error(errorData));

// To retrieve an system error reponse
console.log(status.systemError(systemErrorData));