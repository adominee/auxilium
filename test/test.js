'use strict';
const request=require('supertest');
const app=require('../app');
const passportStub=require('passport-stub');
const {generateError,dateFormat,setNull, ISOFormat, isMine}=require('../routes/module');

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

  test('ログインのためのリンクが含まれる',(done)=>{
    return request(app)
    .get('/login')
    .expect('Content-Type','text/html; charset=utf-8')
    .expect(/<a href="\/auth\/github"/)
    .expect(200,done)
  })

  test('ログイン時はユーザー名が表示される',(done)=>{
    return request(app)
      .get('/login')
      .expect(/testuser/)
      .expect(200,done)
  })
})

describe('/logout',()=>{
  test('/ にリダイレクトされる',(done)=>{
    return request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302,done)
  });
});

describe('generaError関数',()=>{
  test('BadRequestを生成できる',()=>{
    const str='badRequest';
    const err=new Error('不正な要求です');
    err.status=400;
    expect(generateError(str)).toStrictEqual(err);
  })

  test('NotFoundErrorを生成できる',()=>{
    const str='notFound';
    const err=new Error('指定されたページは存在しません');
    err.status=404;
    expect(generateError(str)).toStrictEqual(err);
  })
})

describe('dateFormat関数',()=>{
  test('正しく日時を変換できる',()=>{
    expect(dateFormat(new Date('2014-10-10T04:50:40Z'))).toBe('2014年10月10日 13:50');
  });
})

describe('ISOFormat関数',()=>{
  test('正しくISO8601フォーマットに変換できる',()=>{
    expect(ISOFormat('2014-10-10T04:50:40Z')).toBe('2014-10-10T13:50:40')
  })
})

describe('setNull関数',()=>{
  test('値が代入されていないものにnullを代入する',()=>{
    expect(setNull('AAAA','BBBB')).toBe('BBBB');
  })
})

describe('isMine関数',()=>{
  test('idが異なるならfalseを返す',()=>{
    const a="111",b="121";
    expect(isMine(a,b)).toBe(false);
  })
  
  test('idが同じならtrueを返す',()=>{
    const a="111",b="111";
    expect(isMine(a,b)).toBe(true);
  })
})