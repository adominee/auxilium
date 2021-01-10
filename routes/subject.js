'use strict';

const express=require('express');
const authenticationEnsurer=require('./authentication-ensurer');

const router=express.Router();

const Subject=require('../models/subject');

router.get('/new',authenticationEnsurer,(req,res,next)=>{
  res.render('new-subject');
})

router.post('/',authenticationEnsurer,(req,res,next)=>{
  console.log(req.body);
  res.redirect('/');
  //TODO 参考書の保存
})

module.exports=router;