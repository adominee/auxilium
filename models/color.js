'use strict';
const loader=require('./sequelize-loader');
const Sequelize=loader.Sequelize;

const Color=loader.database.define(
  'Color',
  {
    colorId:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull:false
    },
    colorCode:{
      type:Sequelize.STRING,
      allowNull:false
    }
  }
);

module.exports=Color;