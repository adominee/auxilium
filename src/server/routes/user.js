import {Router} from 'express';

const router=Router();


router.get('/',(req,res)=>{
  if(!req.user){
    res.json({user:null});
    console.log('ユーザー情報が無かったよ')
    return ;
  }
  res.json({user:req.user});
  console.log('ユーザー情報を返したよ')
})

module.exports=router;