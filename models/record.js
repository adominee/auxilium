'use strict';
const loader=require('./sequelize-loader');
const Sequelize=loader.Sequelize;

const Record=loader.database.define(
  'record',
  {
    recordId:{
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
    time:{
      type:Sequelize.INTEGER,
      allowNull:false
    },
    referenceId:{
      type:Sequelize.INTEGER,
      allowNull:false
    },
    mome:{
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
    createdAt:{
      type:Sequelize.DATE,
      allowNull:false
    }
  }
);

module.exports=Record;