import React, {Component} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import ViewItems from '../buyer/view_items'
import ViewBookings from '../buyer/view_bookings'

export default class Buyer_Home extends Component {
    render() {
        return (
            <div>
                <h1>Welcome {localStorage.getItem("user")} (Buyer)</h1>
                <Router>
                    <div className="HomePage">
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <div className="collapse navbar-collapse">
                                <ul className="navbar-nav mr-auto">
                                    <li className="navbar-item">
                                        <Link to="/buyer/view_items" className="nav-link">Search Items</Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link to="/buyer/view_bookings" className="nav-link">View Bookings</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        <br />
                        <Route path="/buyer/view_items" exact component={ViewItems} />
                        <Route path="/buyer/view_bookings" component={ViewBookings} />
                    </div>
                </Router>
            </div>
        )
    }
}    
