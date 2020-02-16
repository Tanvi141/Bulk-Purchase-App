import React, { Component } from 'react';
import axios from 'axios';

export default class CreateUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            user_type: ''  
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleOptionChange = changeEvent => {
        this.setState({
          user_type: changeEvent.target.value });
      };


    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            email: this.state.email,
            user_type: this.state.user_type
        }

        axios.post('http://localhost:4000/add', newUser)
            .then(res => console.log(res.data));

        this.setState({
            username: '',
            email: '',
            user_type: ''
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                        />
                    </div>

                    {/* <div className="form-group">
                        <label>Type: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.user_type}
                            onChange={this.onChangeType}
                        />
                    </div> */}

                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="Buyer"
                                checked={this.state.user_type === "Buyer"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                            Buyer
                        </label>
                     </div>
                     <div className="form-group">   
                        <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="Seller"
                                checked={this.state.user_type === "Seller"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                            Seller
                        </label>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Create User" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}