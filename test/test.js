var statusCodes = require('../dist/index');
var path        = require('path');
var base        = path.normalize(process.cwd());
var chai        = require('chai');
var assert      = chai.assert;

describe('Test module', function() {

  /**
  * try to retreive an status codes without Initialising configuration
  */
  it('should return a default header because config was not initalised', function () {

    var res = statusCodes.get(206);

    assert.equal(res.codeHTTP, 200);
    assert.equal(res.content.code, '404404');
    assert.equal(res.content.status, 'error');
    assert.equal(res.content.message, 'Cannot retrieve current header');
  });

  /**
  * try to load an wrong file
  */
  it('should return false when loading config because file doesnt exist', function () {

    // load configuration
    var res =   statusCodes.loadConfig(base + '/test/configNotExist.json');

    assert.equal(res, false);
  });

  /**
  * try to load config file
  */
  it('should return true when loading file ', function () {

    // load configuration
    var res =   statusCodes.loadConfig(base + '/test/config.json');

    assert.equal(res, true);
  });

  /**
  * try retrieve code 206000
  */
  it('should return code 206', function () {

    // retrieve code
    var res =   statusCodes.get(206);

    assert.equal(res.codeHTTP, 200);
    assert.equal(res.content.code, '206000');
    assert.equal(res.content.status, 'success');
    assert.equal(res.content.message, 'default');
  });

  /**
  * try to retreive an status codes without Initialising configuration
  */
  it('should return a default header because code specified doesnt exist ', function () {

    // retrieve code
    var res = statusCodes.get(209);

    assert.equal(res.codeHTTP, 200);
    assert.equal(res.content.code, '404404');
    assert.equal(res.content.status, 'error');
    assert.equal(res.content.message, 'Cannot retrieve current header');
  });

  /**
  * try retrieve code 206000 with overiden message
  */
  it('should return code 206 with overriden message', function () {

    // retrieve code
    var res =   statusCodes.get(206, 0, { message : 'overriden' });

    assert.equal(res.codeHTTP, 200);
    assert.equal(res.content.code, '206000');
    assert.equal(res.content.status, 'success');
    assert.equal(res.content.message, 'overriden');
  });

  /**
  * try retrieve code 206000 with overiden data
  */
  it('should return code 206 with overriden data', function () {

    // retrieve code
    var res =   statusCodes.get(206, 0, {
      data : {
        overriden : true
      }
    });

    assert.equal(res.codeHTTP, 200);
    assert.equal(res.content.code, '206000');
    assert.equal(res.content.status, 'success');
    assert.equal(res.content.data.overriden, true);
  });

  /**
  * try retrieve code 206000 with overiden data and message
  */
  it('should return code 206 with overriden data and message', function () {

    // retrieve code
    var res =   statusCodes.get(206, 0, {
      data      : {
        overriden : true
      },
      message   : 'overriden'
    });

    assert.equal(res.codeHTTP, 200);
    assert.equal(res.content.code, '206000');
    assert.equal(res.content.status, 'success');
    assert.equal(res.content.data.overriden, true);
    assert.equal(res.content.message, 'overriden');
  });

  /**
  * try to retreive an status codes with wrong data
  */
  it('should return a default header because data is wrong ', function () {

    // retrieve code
    var res = statusCodes.get(206,0, {befe : 'fe'});

    assert.equal(res.codeHTTP, 200);
    assert.equal(res.content.code, '404404');
    assert.equal(res.content.status, 'error');
    assert.equal(res.content.message, 'Cannot retrieve current header');
  });
});
