import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/users-list.component'
import CreateUser from './components/create-user.component'
import Login from './components/login'
import Seller_Home from './components/seller/seller_home';
import Buyer_Home from './components/buyer/buyer_home';
// import Logout from './components/login'
// import AddProduct from './components/seller/add_product'
// import ViewAdded from './components/seller/view_added'


function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          {/* <Link to="/" className="navbar-brand">App</Link> */}
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              {/* <li className="navbar-item">
                <Link to="/" className="nav-link">Users</Link>
              </li> */}
              <li className="navbar-item">
                <Link to="/create" className="nav-link">Create User</Link>
              </li>
              <li className="navbar-item">
                <Link to="/logout" className="nav-link">Logout</Link>
              </li>
              {/* <li className="navbar-item"> */}
              {/* <Link to="/logout" className="nav-link">{localStorage.getItem("user"),alert("Logged Out")}</Link></li> */}
            </ul>
          </div>
        </nav>
        <br/>
        <Route path="/" exact component={UsersList}/>
        <Route path="/create" component={CreateUser}/>
        <Route path="/login" component={Login}/>
        <Route path="/logout" component={Login}/>
        <Route path="/seller/seller_home" component={Seller_Home}/> 
        <Route path="/buyer/buyer_home" component={Buyer_Home}/> 
      </div>
    </Router>
  );
}

export default App;
