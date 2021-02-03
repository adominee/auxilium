'use strict';
const {Sequelize}=require('sequelize');
const dbConfig=new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/auxilium'
);

module.exports=dbConfig