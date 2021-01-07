'use strict';
const loader=require('./sequelize-loader');
const Sequelize=loader.Sequelize;

const Reference=loader.database.define(
  'reference',
  {
    referenceId:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
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
      type:Sequelize.INTEGER,
      allowNull:true
    },
    goalId:{
      type:Sequelize.INTEGER,
      allowNull:true
    }
  }
);

module.exports=Reference;