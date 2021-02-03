'use strict';

const express=require('express');
const authenticationEnsurer=require('./authentication-ensurer');
const uuid=require('uuid')

const router=express.Router();

//データモデルのimport
const Subject=require('../models/subject');
const { generateError, isMine ,csrfProtection} = require('./module');

//教科作成ページ
router.get('/new',authenticationEnsurer,(req,res,next)=>{
  res.render('new-subject');
})

//教科の一覧表示
router.get('/table',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Subject.findAll({
    where:{
      userId:req.user.id
    }
  }).then(subjects=>{
    res.render('table-subject',{
      user:req.user,
      subjects:subjects,
      csrfToken:req.csrfToken()
    })
  })
})

//教科の個別表示
router.get('/:subjectId',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Subject.findOne({
    where:{
      subjectId:req.params.subjectId
    }
  }).then(subject=>{
    if(subject){
      res.render('subject',{
        subject:subject,
        csrfToken:req.csrfToken()
      });
    }else{
      const err=new Error('指定された目標は存在しません');
      err.status=404;
      next(err);
    }
  })
})

//科目の編集ページ表示
router.get('/:subjectId/edit',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Subject.findOne({
    where:{
      userId:req.user.id,
      subjectId:req.params.subjectId
    }
  }).then(subject=>{
    if(!subject){
      const err=generateError('notFound');
      next(err);
      return ;
    }else if(!isMine(subject.userId,req.user.id)){
      const err=generateError('badRequest');
      next(err);
      return ;
    }
    res.render('edit-subject',{
      user:req.user,
      subject:subject,
      csrfToken:req.csrfToken()
    })
  })
})

//教科のDB保存
router.post('/',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  const subjectId=uuid.v4();
  Subject.create({
    subjectId:subjectId,
    userId:req.user.id,
    subjectName:req.body.subjectName.slice(0,255),
    colorCode:req.body.subjectColor
  }).then((subject)=>{
    res.redirect('/subject/'+subject.subjectId);
  })
})

//科目の更新と削除
router.post('/:subjectId',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Subject.findOne({
    where:{
      userId:req.user.id,
      subjectId:req.params.subjectId
    }
  }).then(subject=>{
    if(!subject){
      const err=generateError('notFound');
      next(err);
      return ;
    }
    if(isMine(req.user.id,subject.userId)){
      console.log('本人だよ');
      if(parseInt(req.query.edit)===1){
        console.log('更新するよ');
        subject.subjectName=req.body.subjectName.slice(0,255);
        subject.subjectColor=req.body.subjectColor
        subject.save().then(subject=>{
          res.redirect('/subject/'+subject.subjectId);
        })
        return ;
      }else if(parseInt(req.query.delete)===1){
        console.log('削除するよ');
        subject.destroy().then(()=>{
          res.redirect('/subject/table');
        });
        return ;
      }
    }
    const err=generateError('badRequest');
    next(err);
    return ;
  })
})

module.exports=router;