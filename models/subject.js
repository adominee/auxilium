'use strict';
const Sequelize=require('sequelize');
const dbConfig=require('./db-config');

const Subject=dbConfig.define(
  'Subject',
  {
    subjectId:{
      type:Sequelize.UUID,
      primaryKey:true,
      allowNull:false
    },
    userId:{
      type:Sequelize.INTEGER,
      allowNull:false
    },
    subjectName:{
      type:Sequelize.STRING,
      allowNull:false
    },
    colorCode:{
      type:Sequelize.STRING,
      allowNull:null
    }
  }
);

module.exports=Subject;