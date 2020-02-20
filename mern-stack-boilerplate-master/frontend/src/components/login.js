import React, { Component } from 'react';
import axios from 'axios';


export default class CreateUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            user_type: ''
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangepassword = this.onChangepassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        localStorage.setItem("user", " ");
        // this.props.history.push("/login");
    }

    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangepassword(event) {
        this.setState({ password: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            password: this.state.password
        }


        axios.post('http://localhost:4000/login', newUser)
            .then(res => {
                console.log(res)
                if (res.data.status === "0") {
                    localStorage.setItem("user", newUser.username)
                    if(res.data.type=== "Seller"){
                        this.props.history.push("/seller/seller_home");
                    }
                    else{
                        this.props.history.push("/buyer/buyer_home");
                    }
                }
                else{
                    alert(res.data.msg)
                }            
            });

        this.setState({
            username: '',
            password: ''
        });
    }

    render() {
        return (

            <div>
                <h1>LOGIN PAGE</h1>
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
                        <label>Password: </label>
                        <input type="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangepassword}
                        />
                    </div>
                    {/* 
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
                    </div> */}

                    <div className="form-group">
                        <input type="submit" value="Login" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
