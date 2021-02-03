'use strict';
const Sequelize=require('sequelize');
const dbConfig=require('./db-config');

const User=dbConfig.define(
  'users',
  {
    userId:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      allowNull:false
    },
    username:{
      type:Sequelize.STRING,
      allowNull:false
    }
  },
  {
    freezeTableName:true,
    timestamps:false
  }
);

module.exports=User;