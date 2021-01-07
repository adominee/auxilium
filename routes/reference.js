'use strict';

const express=require('express');
const router=express.Router();
const authenticationEnsurer=require('./authentication-ensurer');

//データモデルのimport
const Reference=require('../models/reference');

router.get('/new',authenticationEnsurer,(req,res,next)=>{
  res.render('new-reference',{user:req.user});
});

//参考書のDB保存
router.post('/',authenticationEnsurer,(req,res,next)=>{
  console.log(req.body);//TODO 参考書を保存する処理
  res.redirect('/');
});

module.exports=router;