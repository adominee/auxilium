'use strict';
const request=require('supertest');
const app=require('../app');
const passportStub=require('passport-stub');
const User = require('../models/user');
const Goal = require('../models/goal');

//ログインのテスト
describe('/login',()=>{
  beforeAll(()=>{
    passportStub.install(app);
    passportStub.login({username:'testuser'});
  });

  afterAll(()=>{
    passportStub.logout();
    passportStub.uninstall(app);
  })

  test('ログインのためのリンクが含まれる',()=>{
    return request(app)
    .get('/login')
    .expect('Content-Type','text/html; charset=utf-8')
    .expect(/<a href="\/auth\/github"/)
    .expect(200);
  })

  test('ログイン時はユーザー名が表示される',()=>{
    return request(app)
      .get('/login')
      .expect(/testuser/)
      .expect(200);
  })

  test('/logoutにアクセスした際に/にリダイレクトされる',()=>{
    return request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302);
  })
})

//目標ページのテスト
describe('/goal',()=>{
  beforeAll(()=>{
    passportStub.install(app);
    passportStub.login({id:0,username:'testuser'});
  });
  
  afterAll(()=>{
    passportStub.logout();
    passportStub.uninstall(app);
  });
    
  test('目標の作成ができ、表示される', done => {
    User.upsert({userId:0,username:'testuser'}).then(()=>{
      //作成できるかのテスト
      request(app)
        .post('/goal')
        .send({
          goalName:'テスト目標1',
          deadline:'2021-01-08T08:52:18.051Z',
          comment:'テストテストテストテスト'
        })
        .expect('Location',/goal/)
        .expect(302)
        .end((err,res)=>{
          const createdGoalPath=res.headers.location;
          //表示されるかのテスト
          request(app)
            .get(createdGoalPath)
            .expect(/テスト目標1/)
            .expect(/Fri Jan 08 2021/)
            .expect(/テストテストテストテスト/)
            .expect(200)
            .end((err,res)=>{
              if(err)return done(err);
              //テストで作成したデータを削除
              const goalId=createdGoalPath.split('/goal/')[1];
              Goal.findByPk(goalId).then(s=>{
                s.destroy().then(()=>{
                  if(err) return done(err);
                  done();
                });
              });
            });
        });
    });
  });
});