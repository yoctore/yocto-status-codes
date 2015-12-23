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

## Configuration file

The configuration file give you the possibility to load predefined data in an jSON file.

Childs categories can only up to 999 like 200999

### Structure of file :

```javascript
[
  // define some parents categories
  {
    "category"  : 200,
    // define some childs categories
    "childs"    :  [
      {
        "code"      : "000",
        "codeHTTP"  : 200,
        "status"    : "success",
        "label"     : "success-base-code",
        "message"   : "Success base code"
      }
    ]
  },
  {
    "category"  : 206,
    // Define childs for level 2060xx like 206000
    "childs"    :  [
      {
        "code"      : "000",
        "codeHTTP"  : 200,
        "status"    : "success",
        "label"     : "success-partial",
        "message"   : "default"
      },
      {
        "category" : 100,
        // Define childs for level 2061xx like 206101
        "childs"   :  [
          {
            "code"      : "101",
            "status"    : "error",
            "codeHTTP"  : 200,
            "label"     : "account-base-error-code",
            "message"   : ""
          }
        ]
      }
    ]
  }
]
```

## How to use

At the moment we only have 5 method implemented, see below :

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

// Load an JSON config file by passing his path
status.loadConfig('/home/config.json');

// Get an existing StatusCode from configuration file
status.get(200, 100);

// Get an existing StatusCode and override field "data" or/and "message"
status.get(200, 100, {
  message : 'overriden message', // optional field
  data    : [ 'this data was overriden' ] // optional field
});
```


## Changelog

All history is [here](https://gitlab.com/yocto-node-modules/yocto-status-codes/blob/master/CHANGELOG.md)
