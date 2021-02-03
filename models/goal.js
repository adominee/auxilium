'use strict';
const Sequelize=require('sequelize');
const dbConfig=require('./db-config');

const Goal=dbConfig.define(
  'goal',
  {
    goalId:{
      type:Sequelize.UUID,
      primaryKey:true,
      allowNull:false
    },
    userId:{
      type:Sequelize.INTEGER,
      allowNull:false
    },
    deadline:{
      type:Sequelize.DATE,
      allowNull:true
    },
    goalName:{
      type:Sequelize.STRING,
      allowNull:false
    },
    comment:{
      type:Sequelize.STRING,
      allowNull:true
    }
  }
)

module.exports=Goal;