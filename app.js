//モジュールのインポート
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet=require('helmet');
var session=require('express-session');
var passport=require('passport');

//データモデルのインポート
var User=require('./models/user');
var Record=require('./models/record');
var Reference=require('./models/reference');
var Subject=require('./models/subject');
var Goal=require('./models/goal');
//リレーションの作成
User.sync().then(async ()=>{
    Subject.belongsTo(User,{foreignKey:'userId'});
    Goal.belongsTo(User,{foreignKey:'userId'});
    await Subject.sync();
    await Goal.sync();
    Reference.belongsTo(User,{foreignKey:'userId'});
    Reference.belongsTo(Subject,{foreignKey:'subjectId'});
    await Reference.sync();
    Record.belongsTo(User,{foreignKey:'userId'});
    Record.belongsTo(Reference,{foreignKey:'referenceId'});
    Record.belongsTo(Subject,{foreignKey:'subjectId'});
    await Record.sync();
});

//GitHubを利用した外部認証
var GitHubStrategy=require('passport-github2').Strategy;
var GITHUB_CLIENT_ID=process.env.GITHUB_CLIENT_ID;
var GITHUB_SECRETS=process.env.GITHUB_SECRETS;
var SESSION_SECRET='c43d016adf44e40a';

passport.serializeUser((user,done)=>{
  done(null,user);
})

passport.deserializeUser((obj,done)=>{
  done(null,obj);
})

passport.use(new GitHubStrategy({
  clientID:GITHUB_CLIENT_ID,
  clientSecret:GITHUB_SECRETS,
  callbackURL:'http://localhost:8000/auth/github/callback'
},
  (accessToken,refreshToken,profile,done)=>{
    process.nextTick(function(){
      User.upsert({
        userId:profile.id,
        username:profile.username
      }).then(()=>{
        done(null,profile);
      })
    })
  }
))

//Router Import
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter=require('./routes/logout');
var recordRouter=require('./routes/record');
var referenceRouter=require('./routes/reference');
var subjectRouter=require('./routes/subject');
var goalRouter=require('./routes/goal');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:SESSION_SECRET,resave:false,saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());

//Router Settings
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout',logoutRouter);
app.use('/record',recordRouter);
app.use('/reference',referenceRouter);
app.use('/subject',subjectRouter);
app.use('/goal',goalRouter);

//GitHubを利用したログイン処理
app.get('/auth/github',
  passport.authenticate('github',{scope:['user:email']}),
  (req,res)=>{}
)
//callbackの処理
app.get('/auth/github/callback',
  passport.authenticate('github',{failiureRedirect:'/login'}),
  (req,res)=>{
    res.redirect('/');
  }
)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;