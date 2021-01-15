'use strict';

const express=require('express');
const authenticationEnsurer=require('./authentication-ensurer');
const uuid=require('uuid')

const router=express.Router();

//データモデルのimport
const Subject=require('../models/subject');

//教科作成ページ
router.get('/new',authenticationEnsurer,(req,res,next)=>{
  res.render('new-subject');
})

//教科の一覧表示
router.get('/table',authenticationEnsurer,(req,res,next)=>{
  const title='Auxilium';
  if(req.user){
    Subject.findAll({
      where:{
        userId:req.user.id
      }
    }).then(subjects=>{
      res.render('subject-table',{
        title:title,
        user:req.user,
        subjects:subjects
      })
    })
  }else{
    res.render('subject-table',{title:title,user:req.user});
  }
})

//教科の個別表示
router.get('/:subjectId',authenticationEnsurer,(req,res,next)=>{
  Subject.findOne({
    where:{
      subjectId:req.params.subjectId
    }
  }).then(subject=>{
    if(subject){
      res.render('subject',{subject:subject});
    }else{
      const err=new Error('指定された目標は存在しません');
      err.status=404;
      next(err);
    }
  })
})

router.post('/',authenticationEnsurer,(req,res,next)=>{
  console.log(req.body);
  const subjectId=uuid.v4();
  Subject.create({
    subjectId:subjectId,
    userId:req.user.id,
    subjectName:req.body.subjectName,
    colorCode:req.body.subjectColor
  }).then((subject)=>{
    res.redirect('/');
    //res.redirect('/subject/'+subject.subjectId);
  })
})

module.exports=router;