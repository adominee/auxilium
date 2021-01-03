'use strict';
const loader=require('./sequelize-loader');
const Sequelize=loader.Sequelize;

const Subject=loader.database.define(
  'Subject',
  {
    subjectId:{
      type:Sequelize.INTEGER,
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
    colorId:{
      type:Sequelize.INTEGER,
      allowNull:true
    }
  }
);

module.exports=Subject;