'use strict';
const {Sequelize}=require('sequelize');
const dbConfig=new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/auxilium',{
    dialect:'postgres',
    protocol:'postgres',
    dialectOptions:{
      ssl:{
        require:true,
        rejectUnauthorized: false
      }
    }
  }
);

module.exports=dbConfig