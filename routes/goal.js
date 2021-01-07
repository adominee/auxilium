'use strict';

const express=require('express');
const router=express.Router();
const authenticationEnsurer=require('./authentication-ensurer');

//データモデルのimport
const Goal=require('../models/goal');

router.get('/new',authenticationEnsurer,(req,res,next)=>{
  res.render('new-goal',{user:req.user});
});

//目標のDB保存
router.post('/',authenticationEnsurer,(req,res,next)=>{
  Goal.create({
    userId:req.user.id,
    deadline:req.body.deadline,
    goalName:req.body.goalName.slice(0,255) || '(名称未設定)',
    comment:req.body.comment
  }).then(()=>{
    res.redirect('/');
  })
});

module.exports=router;