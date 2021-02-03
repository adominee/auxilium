'use strict';

const express=require('express');
const uuid=require('uuid');
const authenticationEnsurer=require('./authentication-ensurer');
const {generateError,dateFormat,setNull,ISOFormat,isMine,csrfProtection}=require('./module');

const router=express.Router();

//データモデルのインポート
const Reference=require('../models/reference');
const Record=require('../models/record');

//記録作成ページ
router.get('/new',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Reference.findAll({
    where:{
      userId:req.user.id
    }
  }).then(references=>{
    const iso=ISOFormat(new Date);
    res.render('new-record',{references:references,iso:iso,csrfToken:req.csrfToken()});
  })
})

//記録一覧表示
router.get('/table',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Record.findAll({
    where:{
      userId:req.user.id
    },
    order:[['recordedAt','DESC']]
  }).then(records=>{
    records.forEach(record=>{
      record.formattedRecordedAt=dateFormat(record.recordedAt);
    })
    res.render('table-record',{
      user:req.user,
      records:records,
      csrfToken:req.csrfToken()
    });
  })
})

//記録の個別表示
router.get('/:recordId',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Record.findOne({
    include:{
      model:Reference,
      attributes:['referenceId','referenceName']
    },
    where:{
      userId:req.user.id,
      recordId:req.params.recordId
    },
  }).then(record=>{
    if(!record){
      const err=generateError('notFound');
      next(err);
      return ;
    }
    record.formattedRecordedAt=dateFormat(record.recordedAt);
    //console.log(record);
    res.render('record',{
      user:req.user,
      record:record,
      csrfToken:req.csrfToken
    })
  })
})

//記録の編集ページの表示
router.get('/:recordId/edit',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Record.findOne({
    include:{
      model:Reference,
      attributes:['referenceId','referenceName']
    },
    where:{
      userId:req.user.id,
      recordId:req.params.recordId
    }
  }).then(record=>{
    if(!record){
      const err=generateError('notFound');
      next(err);
      return ;
    }else if(!isMine(record.userId,req.user.id)){
      const err=generateError('badRequest');
      next(err);
      return ;
    }
    Reference.findAll({
      where:{
        userId:req.user.id
      }
    }).then(references=>{
      record.formattedRecordedAt=ISOFormat(record.recordedAt);
      res.render('edit-record',{
        user:req.user,
        record:record,
        references:references,
        csrfToken:req.csrfToken()
      });
    })
  })
})

//記録保存
router.post('/',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  console.log(req.body);
  isNull(req.body);
  console.log(req.body);
  const recordId=uuid.v4();
  const time=parseInt(req.body.recordMinute);
  Record.create({
    recordId:recordId,
    userId:req.user.id,
    time:time,
    referenceId:req.body.referenceChoice,
    memo:req.body.recordMemo,
    startedAt:req.body.recordStarted,
    endedAt:req.body.recordEnded,
    recordedAt:req.body.recordDate
  }).then(record=>{
    res.redirect('/');
  })
});

//記録の更新と削除
router.post('/:recordId',authenticationEnsurer,csrfProtection,(req,res,next)=>{
  Record.findOne({
    where:{
      userId:req.user.id,
      recordId:req.params.recordId
    }
  }).then(record=>{
    if(!record){
      const err=generateError('notFound');
      next(err);
      return ;
    }
    if(isMine(req.user.id,record.userId)){
      console.log('本人だよ')
      if(parseInt(req.query.edit)===1){
        console.log('更新するよ')
        isNull(req.body);
        const time=parseInt(req.body.recordMinute);
        record.time=time;
        record.referenceId=req.body.referenceChoice;
        record.memo=req.body.recordMemo,
        record.startedAt=req.body.recordStarted;
        record.endedAt=req.body.recordEnded;
        record.recordedAt=req.body.recordDate;
        record.save().then(record=>{
          res.redirect('/record/'+record.recordId);
        })
        return ;
      }else if(parseInt(req.query.delete)===1){
        console.log('削除するよ')
        record.destroy().then(()=>{
          res.redirect('/record/table');
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
  body.referenceChoice=setNull('notCategorize',body.referenceChoice);
  body.recordStarted=setNull('',body.recordStarted);
  body.recordEnded=setNull('',body.recordEnded);
  body.recordMemo=setNull('',body.recordMemo);
}

module.exports=router;