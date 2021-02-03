'use strict';

const express=require('express');
const authenticationEnsurer=require('./authentication-ensurer');
const uuid=require('uuid');

const router=express.Router();

//データモデルのimport
const Reference=require('../models/reference');
const Subject=require('../models/subject');
const { generateError, isMine, setNull ,csrfProtection} = require('./module');

//参考書の新規追加
router.get('/new',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Subject.findAll({
    where:{
      userId:req.user.id
    }
  }).then(subjects=>{
    res.render('new-reference',{
      user:req.user,
      subjects:subjects,
      csrfToken:req.csrfToken()
    })
  })
});

//参考書の一覧表示
router.get('/table',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  if(req.user){
    Reference.findAll({
      include:{
        model:Subject,
        attributes:['subjectId','subjectName']
      },
      where:{
        userId:req.user.id
      }
    }).then(references=>{
      res.render('table-reference',{
        user:req.user,
        references:references,
        csrfToken:req.csrfToken()
      });
    });
  }
});

//参考書の個別表示
router.get('/:referenceId',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Reference.findOne({
    include:{
      model:Subject,
      attributes:['subjectId','subjectName']
    },
    where:{
      userId:req.user.id,
      referenceId:req.params.referenceId
    }
  }).then(reference=>{
    if(!reference){
      const err=generateError('notFound');
      next(err);
      return ;
    }
    res.render('reference',{user:req.user,reference:reference,csrfToken:req.csrfToken()});
  })
})

//教材の編集ページ表示
router.get('/:referenceId/edit',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Reference.findOne({
    include:{
      model:Subject,
      attributes:['subjectId','subjectName']
    },
    where:{
      userId:req.user.id,
      referenceId:req.params.referenceId
    }
  }).then(reference=>{
    if(!reference){
      const err=generateError('notFound');
      next(err);
      return ;
    }else if(!isMine(reference.userId,req.user.id)){
      const err=generateError('badRequest');
      next(err);
      return ;
    }
    Subject.findAll({
      where:{
        userId:req.user.id
      }
    }).then(subjects=>{
      res.render('edit-reference',{
        user:req.user,
        reference:reference,
        subjects:subjects,
        csrfToken:req.csrfToken()
      });
    });
  });
});

//参考書のDB保存
router.post('/',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  console.log(req.body);
  isNull(req.body);
  console.log(req.body);
  const referenceId=uuid.v4();
  Reference.create({
    referenceId:referenceId,
    userId:req.user.id,
    referenceName:req.body.referenceName.slice(0,255),
    referenceNumber:req.body.referenceNumber,
    subjectId:req.body.subjectChoice
  }).then((reference)=>{
    res.redirect('/reference/'+reference.referenceId);
  })
});

//教材の更新と削除
router.post('/:referenceId',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Reference.findOne({
    where:{
      referenceId:req.params.referenceId
    }
  }).then(reference=>{
    if(!reference){
      const err=generateError('notFound');
      next(err);
      return ;
    }
    if(isMine(req.user.id,reference.userId)){
      console.log('本人だよ');
      if(parseInt(req.query.edit)===1){
        console.log('更新');
        isNull(req.body);
        reference.referenceName=req.body.referenceName.slice(0,255),
        reference.referenceNumber=req.body.referenceNumber,
        reference.subjectId=req.body.subjectChoice;
        reference.save().then(reference=>{
          res.redirect('/reference/'+reference.referenceId);
        })
        return ;
      }else if(parseInt(req.query.delete)===1){
        console.log('削除するよ');
        reference.destroy().then(()=>{
          res.redirect('/reference/table');
        })
        return ;
      }
    }
    const err=generateError('badRequest');
    next(err);
    return ;
  })
})

function isNull(body){
  body.subjectChoice=setNull("notCategorize",body.subjectChoice);
}

module.exports=router;