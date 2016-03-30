'use strict';

var _       = require('lodash');
var logger  = require('yocto-logger');
var path    = require('path');
var fs      = require('fs');
var joi     = require('joi');

/**
 * Manage status code response
 *
 * @class Status Codes
 */
function StatusCodes (yLogger) {
  /**
   * Default status rules
   */
  this.defaultStatus = {
    // success item
    success : {
      status : 'success',
      code   : '200'
    },
    // error item
    error   : {
      status : 'error',
      code   : '400'
    },
    // system error item
    system  : {
      status : 'error',
      code   : '500'
    }
  };

  /**
   * Contain external file for error
   */
  this.file = {};

  /**
   * Default logger
   */
  this.logger = yLogger || logger;
}

/**
 * Default method to build default object from given rules
 *
 * @param {String} type default wanted type
 * @param {Object} data default data to append on current object
 * @param {String} message specific message to ad on default object
 * @return {Object|Boolean} builded object false if is invalid
 */
StatusCodes.prototype.buildDefault = function (type, data, message) {
  // type exists ?
  if (_.has(this.defaultStatus, type) && _.isString(type)) {
    // default statement
    var d  = _.extend({}, _.clone(this.defaultStatus[type]), { message : '', data : {} });

    // given data is object ?
    if (_.isObject(data)) {
      // extend data with correct values
      _.extend(d.data, data);
    }

    // assign specific message
    if (_.isString(message) && !_.isEmpty(message)) {
      // change message
      d.message = message;
    }

    // default statement
    return d;
  }

  // invalid statement
  return false;
};

/**
 * Default method to build a valid response object object
 *
 * @param {Object} data default data to append on current object
 * @param {String} message specific message to ad on default object
 * @return {Object|false} builded object false if is invalid
 */
StatusCodes.prototype.success = function (data, message) {
  // default statement
  return this.buildDefault('success', data || {}, message || '');
};

/**
 * Default method to build an error response object object
 *
 * @param {Object} data default data to append on current object
 * @param {String} message specific message to ad on default object
 * @return {Object|false} builded object false if is invalid
 */
StatusCodes.prototype.error = function (data, message) {
  // default statement
  return this.buildDefault('error', data || {}, message || '');
};

/**
 * Default method to build an system response error object object
 *
 * @param {Object} data default data to append on current object
 * @param {String} message specific message to ad on default object
 * @return {Object|false} builded object false if is invalid
 */
StatusCodes.prototype.systemError = function (data, message) {
  // default statement
  return this.buildDefault('system', data || {}, message || '');
};

/**
 * Load an external file to construct response just by specifing error code
 *
 * @param  {String} pathFile the path of the config file
 * @return {boolean} true if file is loaded, otherwise false
 */
StatusCodes.prototype.loadConfig = function (pathFile) {
  // try to load external file
  try {

    // Parse the file
    this.file = JSON.parse(fs.readFileSync(path.normalize(pathFile)));

    // joi schema of the config file
    var schema = joi.array().min(1).items(
      joi.object().required().keys({
        category    : joi.number().integer().required().min(0),
        childs      :  joi.array().required().items(
          joi.alternatives().try(
            joi.object().keys({
              code      : joi.number().integer().required(),
              codeHTTP  : joi.number().integer().required(),
              status    : joi.string().required().empty(),
              label     : joi.string().required().empty(),
              message   : joi.string().required().empty()
            }),
            joi.object().keys({
              category    : joi.number().integer().required().min(0),
              childs      :  joi.array().required().items(
                joi.object().keys({
                  code      : joi.number().integer().required(),
                  codeHTTP  : joi.number().integer().required(),
                  status    : joi.string().required().empty(),
                  label     : joi.string().required().empty(),
                  message   : joi.string().required().empty()
                })
              )
            })
          )
        )
      })
    );

    // validate joi schema with the given file
    var result   = schema.validate(this.file);

    // check if an error occured
    if (result.error) {
      // throw a new exception
      throw ('The joi validation failed, more details : ' + result.error.toString());
    }

    this.logger.info('[ StatusCodes.loadConfig ] - an external configuration file : ' + pathFile +
    ' was loaded with success');
    // Config file was success loaded
    return true;
  } catch (error) {
    // An error occured when loading file
    this.logger.error('[ StatusCodes.loadConfig ] - an error occured when loading external ' +
    'configuration file, more details : ' + error);
    // Config file was not loaded
    return false;
  }
};

/**
 * Retrieve status object from loaded config file
 *
 * @param  {Integer} category  The main category of code (ex : 200 or 400)
 * @param  {String} code       The sub category of code (ex : '101')
 * @return {Object}            Return an object with data of code
 */
StatusCodes.prototype.get = function (category, code, data) {

  // Initialise subCode if is not define
  code = code || '000';

  // Set An default error code to indicate that an error occured and response can't be seet
  var errorResponse = {
    codeHTTP    : 200,
    content     : {
      code      : '404404',
      status    : 'error',
      message   : 'Cannot retrieve current header',
      data      : {}
    }
  };

  // check if an config file exist
  if (_.isEmpty(this.file)) {

    // log error
    this.logger.error('[ response.get ] - error when retriving response, more details :' +
    ' configuration file was not loaded');

    // return error message
    return errorResponse;
  }

  // Schema to check given params
  var schema =  joi.object().keys({
    category : joi.number().required().empty().min(0),
    code     : joi.number().required().empty().min(0).max(999),
    data     : joi.object().optional().keys({
      data    : joi.any().optional().default({}),
      message : joi.string().optional()
    }).default({ data : {} })
  });

  // test if schema of object was ok
  var result = joi.validate({
    category    : category,
    code        : code,
    data        : data
  }, schema);

  // parse the Integer code into string that have 3 character
  code = ('00' + code).slice(-3);

  // override data with default value from joi schema
  data = result.value.data;

  // define final object to return
  var response = {};

  // try to create final object
  try {

    // Test if joi validation failed
    if (!_.isEmpty(result.error)) {
      throw result.error;
    }

    // Retrieve and clone the main category in file
    var mainCategoryFound     = _.clone(_.find(this.file, { 'category' : category })) || [];

    // Test if is main category
    if (_.parseInt(code) <= 100) {
      response  = _.clone(_.find(mainCategoryFound.childs, { code : code }));
    } else {

      // found subcategory
      var subcategoryFound  = _.clone(_.find(mainCategoryFound.childs,
        { category : _.floor(_.parseInt(code), -2) }) || []
      );

      // clone response
      response = _.clone(_.find(subcategoryFound.childs, { code : code }) || {});
    }

    // If undefined return the default header error
    if (_.isUndefined(response) || _.isEmpty(response)) {
      // return an default error message
      return errorResponse;
    }

    // Set code error
    response.code = category.toString() + response.code;

    // return the final object
    response = {
      codeHTTP : response.codeHTTP,
      // omit uncessary keys form config
      content  : _.omit(response, [ 'label', 'codeHTTP' ])
    };

    // set content key
    response.content = _.extend(response.content, data);

    // return the response
    return response;
  } catch (error) {
    // set error response
    response = errorResponse;

    // An error occured
    this.logger.error('[ response.get ] - error when retriving response, more details :', error);

    // return the response
    return response;
  }
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    logger.warning('[ Yocto-status-code.constructor ] - Invalid logger given. Use internal logger');
    // assign
    l = logger;
  }
  // default statement
  return new (StatusCodes)(l);
};
