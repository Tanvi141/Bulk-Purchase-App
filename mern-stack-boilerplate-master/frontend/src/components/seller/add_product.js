import React, { Component } from 'react';
import axios from 'axios';

export default class AddProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Name: '',
            Price: '',
            Quantity: '',
            Quantity_left: ''  
        }

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeName(event) {
        this.setState({ Name: event.target.value });
    }

    onChangePrice(event) {
        this.setState({ Price: event.target.value });
    }

    onChangeQuantity(event) {
        this.setState({ Quantity: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        console.log("here")
        const Product = {
            name: this.state.Name,
            price: this.state.Price,
            quantity: this.state.Quantity,
            quantity_left: this.state.Quantity,
            seller_id: localStorage.getItem("user")
        }

        axios.post('http://localhost:4000/seller/add_product', Product)
            .then(res =>{ 
                console.log(res)
                console.log(res.data.msg);
                alert(res.data.msg)
            });

        this.setState({
            Name: '',
            Price: '',
            Quantity: '',
            Quantity_left: ''
        });
    }

    render() {
        return (
            
            <div>
                <h1>ADD A PRODUCT</h1>
                <br></br>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.Name}
                            onChange={this.onChangeName}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Price: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.Price}
                            onChange={this.onChangePrice}
                        />
                    </div>

                    <div className="form-group">
                        <label>Quantity: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.Quantity}
                            onChange={this.onChangeQuantity}
                        />
                    </div>

                    
                    <div className="form-group">
                        <input type="submit" value="Add Product" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}