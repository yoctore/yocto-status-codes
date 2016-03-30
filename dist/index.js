/* yocto-status-codes - Manage and retreive status code & more defined data from given rules. - V1.2.2 */
"use strict";function StatusCodes(a){this.defaultStatus={success:{status:"success",code:"200"},error:{status:"error",code:"400"},system:{status:"error",code:"500"}},this.file={},this.logger=a||logger}var _=require("lodash"),logger=require("yocto-logger"),path=require("path"),fs=require("fs"),joi=require("joi");StatusCodes.prototype.buildDefault=function(a,b,c){if(_.has(this.defaultStatus,a)&&_.isString(a)){var d=_.extend({},_.clone(this.defaultStatus[a]),{message:"",data:{}});return _.isObject(b)&&_.extend(d.data,b),_.isString(c)&&!_.isEmpty(c)&&(d.message=c),d}return!1},StatusCodes.prototype.success=function(a,b){return this.buildDefault("success",a||{},b||"")},StatusCodes.prototype.error=function(a,b){return this.buildDefault("error",a||{},b||"")},StatusCodes.prototype.systemError=function(a,b){return this.buildDefault("system",a||{},b||"")},StatusCodes.prototype.loadConfig=function(a){try{this.file=JSON.parse(fs.readFileSync(path.normalize(a)));var b=joi.array().min(1).items(joi.object().required().keys({category:joi.number().integer().required().min(0),childs:joi.array().required().items(joi.alternatives()["try"](joi.object().keys({code:joi.number().integer().required(),codeHTTP:joi.number().integer().required(),status:joi.string().required().empty(),label:joi.string().required().empty(),message:joi.string().required().empty()}),joi.object().keys({category:joi.number().integer().required().min(0),childs:joi.array().required().items(joi.object().keys({code:joi.number().integer().required(),codeHTTP:joi.number().integer().required(),status:joi.string().required().empty(),label:joi.string().required().empty(),message:joi.string().required().empty()}))})))})),c=b.validate(this.file);if(c.error)throw"The joi validation failed, more details : "+c.error.toString();return this.logger.info("[ StatusCodes.loadConfig ] - an external configuration file : "+a+" was loaded with success"),!0}catch(d){return this.logger.error("[ StatusCodes.loadConfig ] - an error occured when loading external configuration file, more details : "+d),!1}},StatusCodes.prototype.get=function(a,b,c){b=b||"000";var d={codeHTTP:200,content:{code:"404404",status:"error",message:"Cannot retrieve current header",data:{}}};if(_.isEmpty(this.file))return this.logger.error("[ response.get ] - error when retriving response, more details : configuration file was not loaded"),d;var e=joi.object().keys({category:joi.number().required().empty().min(0),code:joi.number().required().empty().min(0).max(999),data:joi.object().optional().keys({data:joi.any().optional()["default"]({}),message:joi.string().optional()})["default"]({data:{}})}),f=joi.validate({category:a,code:b,data:c},e);b=("00"+b).slice(-3),c=f.value.data;var g={};try{if(!_.isEmpty(f.error))throw f.error;var h=_.clone(_.find(this.file,{category:a}))||[];if(_.parseInt(b)<=100)g=_.clone(_.find(h.childs,{code:b}));else{var i=_.clone(_.find(h.childs,{category:_.floor(_.parseInt(b),-2)})||[]);g=_.clone(_.find(i.childs,{code:b})||{})}return _.isUndefined(g)||_.isEmpty(g)?d:(g.code=a.toString()+g.code,g={codeHTTP:g.codeHTTP,content:_.omit(g,["label","codeHTTP"])},g.content=_.extend(g.content,c),g)}catch(j){return g=d,this.logger.error("[ response.get ] - error when retriving response, more details :",j),g}},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning("[ Yocto-status-code.constructor ] - Invalid logger given. Use internal logger"),a=logger),new StatusCodes(a)};