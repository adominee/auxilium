import React from 'react';

export default class Auth extends React.Component{
  constructor(props){
    super(props);
    this.state={
      error:null,
      isLoaded:false,
      user:null
    }
  }

  componentDidMount(){
    fetch('/api/user')
      .then(res=>res.json())
      .then(user=>{
        this.setState({
          isLoaded:true,
          user:user.user
        });
        console.log(this.state.error);
        console.log(this.state.isLoaded)
      },error=>{
        this.setState({
          isLoaded:true,
          error
        });
      }
    )
  }

  login(){
    fetch('/auth/github')
    
  }

  render(){
    const {error,isLoaded,user}=this.state;
    if(error){
      return <div>Error:{error.message}</div>
    }else if(!isLoaded){
      return <div>Loading...</div>
    }else{
      console.log(user);
      if(user){
        return(
          <h2>{user.name}でログイン中</h2>
        )
      }else{
        return(
          <div>
            <button onClick={this.login}></button>
            <a href="/auth/github">ログイン</a>
          </div>
        )
      }
    }
  }
}

//apiサーバーへのアクセスはAPIコールなのだからaタグを使うのはおかしい
//onClickなどで適時関数を用いるべきなのでは？