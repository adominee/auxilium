'use strict';

const express=require('express');
const authenticationEnsurer=require('./authentication-ensurer');
const uuid=require('uuid')
const format=require('date-fns/format');

const router=express.Router();

//データモデルのimport
const Goal=require('../models/goal');
const { generateError, isMine} = require('./module');

router.get('/new',authenticationEnsurer,(req,res,next)=>{
  res.render('new-goal',{user:req.user});
});

//目標の一覧表示
router.get('/table',authenticationEnsurer,(req,res,next)=>{
  Goal.findAll({
    where:{
      userId:req.user.id
    },
  }).then(goals=>{
    goals.forEach(goal=>{
      goal.formattedDeadline=dateFormat(goal.deadline);
    })
    res.render('table-goal',{
      user:req.user,
      goals:goals
    });
  });
})

//目標の個別表示
//TODO 目標所属の参考書を表示
router.get('/:goalId',authenticationEnsurer,(req,res,next)=>{
  Goal.findOne({
    where:{
      goalId:req.params.goalId
    }
  }).then(goal=>{
    if(!goal){
      const err=new Error('指定された目標は存在しません。');
      err.status=404;
      next(err);
      return ;
    }
    goal.formattedDeadline=dateFormat(goal.deadline);
    res.render('goal',{
      user:req.user,
      goal:goal
    })
  });
});

//目標の編集ページ表示
router.get('/:goalId/edit',authenticationEnsurer,(req,res,next)=>{
  Goal.findOne({
    where:{
      userId:req.user.id,
      goalId:req.params.goalId
    }
  }).then(goal=>{
    if(!goal){
      next(generateError('notFound'));
      return ;
    }else if(!isMine(req.user.id,goal.userId)){
      next(generateError('badRequest'));
      return ;
    }
    goal.formattedDeadline=format(new Date(goal.deadline),'yyyy-MM-dd');
    res.render('edit-goal',{
      user:req.user,
      goal:goal
    });
  });
});

//目標のDB保存
router.post('/',authenticationEnsurer,(req,res,next)=>{
  const goalId=uuid.v4();
  Goal.create({
    goalId:goalId,
    userId:req.user.id,
    deadline:req.body.deadline,
    goalName:req.body.goalName.slice(0,255),
    comment:req.body.comment
  }).then((goal)=>{
    res.redirect('/goal/'+goal.goalId);
  })
});

//目標の更新と削除
router.post('/:goalId',authenticationEnsurer,(req,res,next)=>{
  Goal.findOne({
    where:{
      userId:req.user.id,
      goalId:req.params.goalId
    }
  }).then(goal=>{
    if(!goal){
      next(generateError('notFound'));
      return ;
    }
    if(isMine(req.user.id,goal.userId)){
      console.log('本人だよ');
      if(parseInt(req.query.edit)===1){
        console.log('更新するよ');
        goal.goalName=req.body.goalName.slice(0,255);
        goal.deadline=req.body.deadline;
        goal.comment=req.body.comment;
        goal.save().then(goal=>{
          res.redirect('/goal/'+goal.goalId);
        })
        return ;
      }else if(parseInt(req.query.delete)===1){
        console.log('削除するよ');
        goal.destroy().then(()=>{
          res.redirect('/goal/table');
        })
        return ;
      }
    }
    next(generateError('badRequest'));
    return ;
  })
})

function dateFormat(date){
  return format(new Date(date),"yyyy年MM月dd日");
}

module.exports=router;