import React, {Component} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import AddProduct from './add_product'
import ViewAdded from './view_added'
import ViewDispatched from './view_dispatched'
import ViewDispatchable from './view_dispatchable'

export default class Seller_Home extends Component {
    render() {
        return (
            <div>
                <h1>Welcome {localStorage.getItem("user")} (Seller)</h1>
                <Router>
                    <div className="HomePage">
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <div className="collapse navbar-collapse">
                                <ul className="navbar-nav mr-auto">
                                    <li className="navbar-item">
                                        <Link to="/seller/add_product" className="nav-link">Add Product</Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link to="/seller/view_added" className="nav-link">View Added</Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link to="/seller/dispatchable" className="nav-link">View Dispatchable</Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link to="/seller/dispatch" className="nav-link">View Dispatched</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <br />

                        <Route path="/seller/add_product" exact component={AddProduct} />
                        <Route path="/seller/view_added" exact component={ViewAdded} />
                        <Route path="/seller/dispatchable" exact component={ViewDispatchable} />
                        <Route path="/seller/dispatch" exact component={ViewDispatched} />
                    </div>
                </Router>
            </div>
        )
    }
}    
