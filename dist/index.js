/* yocto-status-codes - Manage and retreive status code & more defined data from given rules. - V1.1.2 */
"use strict";function StatusCodes(){this.defaultStatus={success:{status:"success",code:"200"},error:{status:"error",code:"400"},system:{status:"error",code:"500"}}}var _=require("lodash");StatusCodes.prototype.buildDefault=function(a,b,c){if(_.has(this.defaultStatus,a)&&_.isString(a)){var d=_.extend({},_.clone(this.defaultStatus[a]),{message:"",data:{}});return _.isObject(b)&&_.extend(d.data,b),_.isString(c)&&!_.isEmpty(c)&&(d.message=c),d}return!1},StatusCodes.prototype.success=function(a,b){return this.buildDefault("success",a||{},b||"")},StatusCodes.prototype.error=function(a,b){return this.buildDefault("error",a||{},b||"")},StatusCodes.prototype.systemError=function(a,b){return this.buildDefault("system",a||{},b||"")},module.exports=new StatusCodes;