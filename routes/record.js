'use strict';

const express=require('express');
const uuid=require('uuid');
const authenticationEnsurer=require('./authentication-ensurer');
const {generateError,dateFormat,setNull,ISOFormat}=require('./module');

const router=express.Router();

//データモデルのインポート
const Reference=require('../models/reference');
const Record=require('../models/record');

//記録作成ページ
router.get('/new',authenticationEnsurer,(req,res,next)=>{
  Reference.findAll({
    where:{
      userId:req.user.id
    }
  }).then(references=>{
    res.render('new-record',{references:references});
  })
})

//記録一覧表示
router.get('/table',authenticationEnsurer,(req,res,next)=>{
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
      records:records
    });
  })
})

//記録の個別表示
router.get('/:recordId',authenticationEnsurer,(req,res,next)=>{
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
      record:record
    })
  })
})

//記録の編集ページの表示
router.get('/:recordId/edit',authenticationEnsurer,(req,res,next)=>{
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
    Reference.findAll({
      where:{
        userId:req.user.id
      }
    }).then(references=>{
      if(!record){
        const err=generateError('notFound');
        next(err);
        return ;
      }else if(parseInt(record.userId)!=parseInt(req.user.id)){
        const err=generateError('badRequest');
        next(err);
      }
      record.formattedRecordedAt=ISOFormat(record.recordedAt);
      res.render('edit-record',{
        user:req.user,
        record:record,
        references:references
      });
    })
  })
})

//記録保存
router.post('/',authenticationEnsurer,(req,res,next)=>{
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

//記録の追記
router.post('/:recordId',authenticationEnsurer,(req,res,next)=>{
  Record.findOne({
    where:{
      recordId:req.params.recordId
    }
  }).then(record=>{
    if(isMine(req,record)&&(parseInt(req.query.edit)===1)){
      isNull(req.body);
      const time=parseInt(req.body.recordMinute);
      record.time=time;
      record.referenceId=req.body.referenceChoice;
      record.memo=req.body.recordMemo;
      record.startedAt=req.body.recordStarted;
      record.endedAt=req.body.recordEnded;
      record.recordedAt=req.body.recordDate;
      record.save().then(record=>{
        res.redirect('/record/'+record.recordId);
      }).catch(err=>{
        console.err(err);
        res.redirect('/error');
      })
    }else{
      const err=generateError('badRequest');
      next(err);
    }
  })
})

function isNull(body){
  body.referenceChoice=setNull('notCategorize',body.referenceChoice);
  body.recordStarted=setNull('',body.recordStarted);
  body.recordEnded=setNull('',body.recordEnded);
  body.recordMemo=setNull('',body.recordMemo);
}

function isMine(req,data){
  return data && parseInt(data.userId) ===parseInt(req.user.id);
}

module.exports=router;