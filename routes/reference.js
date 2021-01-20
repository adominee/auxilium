'use strict';

const express=require('express');
const authenticationEnsurer=require('./authentication-ensurer');
const uuid=require('uuid');

const router=express.Router();

//データモデルのimport
const Reference=require('../models/reference');
const Subject=require('../models/subject');
const Goal=require('../models/goal');
const { sub } = require('date-fns');

//参考書の新規追加
router.get('/new',authenticationEnsurer,(req,res,next)=>{
  Subject.findAll({
    where:{
      userId:req.user.id
    }
  }).then(subjects=>{
    res.render('new-reference',{
      user:req.user,
      subjects:subjects,
    })
  })
});

//参考書の一覧表示
router.get('/table',authenticationEnsurer,(req,res,next)=>{
  if(req.user){
    Reference.findAll({
      where:{
        userId:req.user.id
      }
    }).then(references=>{
      res.render('reference-table',{
        user:req.user,
        references:references
      });
    });
  }
});

//参考書の個別表示
router.get('/:referenceId',authenticationEnsurer,(req,res,next)=>{
  Reference.findOne({
    include:{
      model:Subject,
      attributes:['subjectId','subjectName']
    },
    where:{
      referenceId:req.params.referenceId
    }
  }).then(reference=>{
    if(!reference){
      const err=new Error('指定された目標は存在しません');
      err.status=404;
      next(err);
      return ;
    }
    Subject.findOne({
      where:{
        subjectId:reference.subjectId
      }
    }).then(subject=>{
      if(subject){
        res.render('reference',{user:req.user,reference:reference,subject:subject});
      }else{
        res.render('reference',{user:req.user,reference:reference});
      }
    })
  })
})

//参考書のDB保存
router.post('/',authenticationEnsurer,(req,res,next)=>{

  console.log(req.body);
  if(req.body.subjectChoice=="notCategorize")req.body.subjectChoice=null;
  const referenceId=uuid.v4();
  Reference.create({
    referenceId:referenceId,
    userId:req.user.id,
    referenceName:req.body.referenceName,
    referenceNumber:req.body.referenceNumber,
    subjectId:req.body.subjectChoice
  }).then((reference)=>{
    res.redirect('/');
  })
});

module.exports=router;