'use strict';
const loader=require('./sequelize-loader');
const Sequelize=loader.Sequelize;

const Reference=loader.database.define(
  'reference',
  {
    referenceId:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      allowNull:false
    },
    userId:{
      type:Sequelize.INTEGER,
      allowNull:false
    },
    referenceName:{
      type:Sequelize.STRING,
      allowNull:false
    },
    subjectId:{
      type:Sequelize.INTEGER,
      allowNull:false
    },
    goalId:{
      type:Sequelize.INTEGER,
      allowNull:true
    }
  }
);

module.exports=Reference;