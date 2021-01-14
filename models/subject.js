'use strict';
const loader=require('./sequelize-loader');
const Sequelize=loader.Sequelize;

const Subject=loader.database.define(
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