'use strict';

var _       = require('lodash');

/**
 * Manage status code response
 *
 * @class Status Codes
 */
function StatusCodes () {
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

// Default export
module.exports = new (StatusCodes)();
