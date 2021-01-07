'use strict';
const loader=require('./sequelize-loader');
const Sequelize=loader.Sequelize;

const Goal=loader.database.define(
  'goal',
  {
    goalId:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
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