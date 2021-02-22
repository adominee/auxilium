import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Route,Link} from 'react-router-dom';
import IsLogin from './auth';
import ErrorPage from './error';

class Auxilium extends React.Component{
  render(){
    return(
      <BrowserRouter>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
          </ul>
          <Route exact path="/" component={Home}/>
          <Route path="/loginError" component={ErrorPage}/>
        </div>
      </BrowserRouter>
    )
  }
}


class Home extends React.Component{
  render(){
    return(
      <div>
        <h2>Home</h2>
        <IsLogin/>
      </div>
    )
  }
}

ReactDOM.render(<Auxilium />, document.getElementById('index')); 