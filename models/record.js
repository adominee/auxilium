'use strict';
const Sequelize=require('sequelize');
const dbConfig=require('./db-config');

const Record=dbConfig.define(
  'record',
  {
    recordId:{
      type:Sequelize.UUID,
      primaryKey:true,
      allowNull:false
    },
    userId:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      allowNull:false
    },
    time:{
      type:Sequelize.INTEGER,
      allowNull:false
    },
    referenceId:{
      type:Sequelize.UUID,
      allowNull:true
    },
    memo:{
      type:Sequelize.STRING,
      allowNull:true
    },
    startedAt:{
      type:Sequelize.INTEGER,
      allowNull:true
    },
    endedAt:{
      type:Sequelize.INTEGER,
      allowNull:true
    },
    recordedAt:{
      type:Sequelize.DATE,
      allowNull:false
    }
  }
);

module.exports=Record;