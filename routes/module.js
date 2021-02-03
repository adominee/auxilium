'use strict';
const format=require('date-fns/format');

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

exports.generateError=function(selecter){
  const object=errorObject[selecter];
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