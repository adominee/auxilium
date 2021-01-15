'use strict';

const express=require('express');
const authenticationEnsurer=require('./authentication-ensurer');
const uuid=require('uuid')
const format=require('date-fns/format');
const ja=require('date-fns/locale/ja');

const router=express.Router();

//データモデルのimport
const Goal=require('../models/goal');

router.get('/new',authenticationEnsurer,(req,res,next)=>{
  res.render('new-goal',{user:req.user});
});

//目標の一覧表示
router.get('/table',authenticationEnsurer,(req,res,next)=>{
  const title='Auxilium';
  if(req.user){
    Goal.findAll({
      where:{
        userId:req.user.id
      },
      order:['goalId','DESC']
    }).then(goals=>{
      res.render('goal-table',{
        title:title,
        user:req.user,
        goals:goals
      });
    });
  }else{
    res.render('goal-table',{title:title,user:req.user});
  }
})

//目標の個別表示
//TODO goalIdを連番からUUIDへの変更
//TODO 目標所属の参考書を表示
router.get('/:goalId',authenticationEnsurer,(req,res,next)=>{
  Goal.findOne({
    where:{
      goalId:req.params.goalId
    }
  }).then(goal=>{
    if(goal){
      res.render('goal',{
        goal:goal,
      })
    }else{
      const err=new Error('指定された目標は存在しません。');
      err.status=404;
      next(err);
    }
  });
});

//目標のDB保存
router.post('/',authenticationEnsurer,(req,res,next)=>{
  const goalId=uuid.v4();
  Goal.create({
    goalId:goalId,
    userId:req.user.id,
    deadline:req.body.deadline,
    goalName:req.body.goalName.slice(0,255) || '(名称未設定)',
    comment:req.body.comment
  }).then((goal)=>{
    res.redirect('/goal/'+goal.goalId);
  })
});

module.exports=router;