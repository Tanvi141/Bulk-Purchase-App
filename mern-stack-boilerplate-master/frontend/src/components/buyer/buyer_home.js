import React, {Component} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import ViewItems from '../buyer/view_items'

export default class Buyer_Home extends Component {
    render() {
        return (
            <div>
                <h1>Welcome Buyer</h1>
                <Router>
                    <div className="HomePage">
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <div className="collapse navbar-collapse">
                                <ul className="navbar-nav mr-auto">
                                    <li className="navbar-item">
                                        <Link to="/buyer/view_items" className="nav-link">View Items</Link>
                                    </li>
                                    {/* <li className="navbar-item">
                                        <Link to="/seller/view_added" className="nav-link">View Added</Link>
                                    </li> */}
                                </ul>
                            </div>
                        </nav>
                        <br />
                        <Route path="/buyer/view_items" exact component={ViewItems} />
                    </div>
                </Router>
            </div>
        )
    }
}    
