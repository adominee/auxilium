'use strict';

const express=require('express');
const uuid=require('uuid');
const authenticationEnsurer=require('./authentication-ensurer');

const router=express.Router();

//記録作成ページ
router.get('/new',authenticationEnsurer,(req,res,next)=>{
  res.render('new-record');
})

//記録一覧表示
router.get('/table',authenticationEnsurer,(req,res,next)=>{
  res.render('record-table',{
    user:req.user
  });
})

router.post('/record',authenticationEnsurer,(req,res,next)=>{
  
})

module.exports=router;