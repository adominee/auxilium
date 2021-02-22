import express from 'express';
import path from 'path';
import passport from 'passport';
import {Strategy as GitHubStrategy} from 'passport-github2';
import session from 'express-session';

//Router Import
import apiRouter from './routes/index';
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';

const app = express();

app.use(express.static(path.resolve('./', 'dist')));

//GitHubを利用した外部認証
var GITHUB_CLIENT_ID=process.env.GITHUB_CLIENT_ID_REACT_AUXILIUM;
var GITHUB_CLIENT_SECRETS=process.env.GITHUB_CLIENT_SECRETS_REACT_AUXILIUM;
var SESSION_SECRET='c53d016adf44e40a';

passport.serializeUser((user,done)=>{
  done(null,user);
})

passport.deserializeUser((obj,done)=>{
  done(null,obj);
})

passport.use(new GitHubStrategy({
  clientID:GITHUB_CLIENT_ID,
  clientSecret:GITHUB_CLIENT_SECRETS,
  callbackURL:'http://localhost:3000/auth/github/callback'
},
  ()=>{
  }
))

app.all('/*',(res,next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  next();
})
app.use(session({secret:SESSION_SECRET,resave:false,saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/api',apiRouter);

app.get('/auth/github',
  passport.authenticate('github',{scope:['user:email']}),
  ()=>{}
)

app.get('/auth/github/callback',
  passport.authenticate('github',{successRedirect:'/',failureRedirect:'/'})
)

app.listen(3000, ()=> {
  console.log('server running');
})