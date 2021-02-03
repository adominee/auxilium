'use strict';
const Sequelize=require('sequelize');
const dbConfig=require('./db-config');

const Reference=dbConfig.define(
  'reference',
  {
    referenceId:{
      type:Sequelize.UUID,
      primaryKey:true,
      allowNull:false
    },
    userId:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      allowNull:false
    },
    referenceName:{
      type:Sequelize.STRING,
      allowNull:false
    },
    referenceNumber:{
      type:Sequelize.INTEGER,
      allowNull:true
    },
    subjectId:{
      type:Sequelize.UUID,
      allowNull:true
    }
  }
);

module.exports=Reference;