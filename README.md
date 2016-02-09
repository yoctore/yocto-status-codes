![alt text](https://david-dm.org/yoctore/yocto-status-codes.svg "Dependencies Status")

## Overview

This module is a part of yocto node modules for NodeJS.

Please see [our NPM repository](https://www.npmjs.com/~yocto) for complete list of available tools (completed day after day).

Manage and retrieve status code & more defined data from given rules.

## Motivation

Create a standard response format for our [yocto-core-stack](https://www.npmjs.com/package/yocto-core-stack) application

## Which format have response ?

All reponse given by this module has format below : 

```javascript
{
  status  : "success|error", // Always success or error
  code    : "200|400|500", // At the moment only this three values
  message : "", // a specific message, can be overload 
  data    : {} // a specific data, can be overload 
}
```

## How to use

At the moment we only have 3 method implemented, see below : 

```javascript

var status = require('yocto-status-codes');

var successData = { message : 'Yeah !', data : { foo : 'bar' } };
var errorData = { message : 'Bad !', data : { foo : 'bar error' } };
var systemErrorData = { message : 'Very bad !', data : { foo : 'bar system' } };

// To retrieve a success reponse
status.success(successData);

// To add a specific message on base response just do
status.success(successData, 'message');
// it works too for error and system erro

// To retrieve an error reponse
status.error(errorData);

// To retrieve an system error reponse
status.systemError(systemErrorData);
```

## Next Step

- Implement external sources (config files) based on http code format.

## Changelog

All history is [here](https://gitlab.com/yocto-node-modules/yocto-status-codes/blob/master/CHANGELOG.md)