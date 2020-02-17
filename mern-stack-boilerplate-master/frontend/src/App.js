import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/users-list.component'
import CreateUser from './components/create-user.component'
import Login from './components/login'
import AddProduct from './components/seller/add_product'
import ViewAdded from './components/seller/view_added'

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
              <li className="navbar-item">
                <Link to="/" className="nav-link">Users</Link>
              </li>
              <li className="navbar-item">
                <Link to="/create" className="nav-link">Create User</Link>
              </li>
              <li className="navbar-item">
                <Link to="/seller/add_product" className="nav-link">Add Product</Link>
              </li>
              <li className="navbar-item">
                <Link to="/seller/view_added" className="nav-link">View Added</Link>
              </li>
            </ul>
          </div>
        </nav>

        <br/>
        <Route path="/seller/view_added" component={ViewAdded}/>
        <Route path="/" exact component={UsersList}/>
        <Route path="/create" component={CreateUser}/>
        <Route path="/login" component={Login}/>
        <Route path="/seller/add_product" component={AddProduct}/>
      </div>
    </Router>
  );
}

export default App;
