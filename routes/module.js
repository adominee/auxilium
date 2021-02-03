'use strict';

const format=require('date-fns/format');
const csrf=require('csurf');

exports.csrfProtection=csrf({cookie:true});

const errorObject={
  badRequest:{
    status:400,
    str:'不正な要求です'
  },
  notFound:{
    status:404,
    str:'指定されたページは存在しません'
  },
}

//TODO 指定されたワード以外が渡された時の処理
exports.generateError=function(select){
  const object=errorObject[select];
  const err=new Error(object.str);
  err.status=object.status
  return err;
}

exports.dateFormat= function(date){
  return format(new Date(date),"yyyy年MM月dd日 HH:mm");
}

exports.ISOFormat=function(data){
  return format(new Date(data),"yyyy-MM-dd'T'HH:mm:ss");
}

exports.setNull=function(judge,variable){
  if(judge===variable)return null;
  else return variable;
}

exports.isMine=function(key1,key2){
  return parseInt(key1) ===parseInt(key2);
}