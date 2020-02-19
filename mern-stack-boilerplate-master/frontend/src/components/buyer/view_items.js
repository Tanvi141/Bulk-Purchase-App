import React, {Component} from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css"

export default class ViewItems extends Component {
    
    constructor(props) {
        super(props);
        this.state = {products: []}
        this.state.Name="";
        this.state={
            showComponent : false,
        };

        this.onChangeName = this.onChangeName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeName(event) {
        this.setState({ Name: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state.Name)

        const send={
            search: this.state.Name
        }
    
        axios.post('http://localhost:4000/buyer/results',send)
             .then(response => {
                 this.setState({
                     products: response.data,
                     showComponent: true
                    });
                 console.log(this.state.products)
             })
             .catch(function(error) {
                 console.log(error);
             })

        this.setState({
            Name: ''
        });

        
    }
    
    render() {
        return (
            <div>
                <h1>Search For Item</h1>
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
                        <input type="submit" value="Search" className="btn btn-primary" />
                    </div>
                </form>
                {this.state.showComponent && <TableContent products={this.state.products}/>}
            </div>
        )
    }
}

class TableContent extends React.Component {


    constructor(props) {
        super(props);
        // console.log(this.props.products);
        this.state={
            showComponent : false,
        };
    }

    edit = (data) => { 
        // console.log(data)
        this.setState({
            buy: data,
            showComponent: true
        });
    }

    render() {
        return (
            <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity Total</th>
                        <th>Quantity Left</th>
                        <th>Seller</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                { 
                    this.props.products.map((currentProduct, i) => {
                        return (
                            <tr>
                                <td>{currentProduct.name}</td>
                                <td>{currentProduct.price}</td>
                                <td>{currentProduct.quantity}</td>
                                <td>{currentProduct.quantity_left}</td>
                                <td>{currentProduct.seller_id}</td>
                                <td>{currentProduct.status}</td>
                                <td><button onClick={() => this.edit(currentProduct)}>Order</button></td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            {this.state.showComponent && <PlaceOrder buy={this.state.buy}/>}
            </div>
        )
    }
}

class PlaceOrder extends React.Component {

    constructor(props) {
        super(props);
        console.log("mounted");
        console.log(this.props.buy);
        this.state={
            Value : '',
        };

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeValue(event) {
        this.setState({ Value: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state.Value)

        const send={
            item: this.props.buy,
            value: this.state.Value,
            buyer_name: localStorage.getItem("user")
        }
        
        axios.post('http://localhost:4000/buyer/trybuy',send)
             .then(response => {
                 alert(response.data.msg)
                 console.log(response)
             })
             .catch(function(error) {
                 console.log(error);
        })

        this.setState({
            Value: ''
        });
    }

    render() {
        return (
            <div>
            <div class="border col-sm">
            <br></br><br></br>
            <p>Product Name: {this.props.buy.name}</p>
            <p>Seller: {this.props.buy.seller_id}</p>
            <p>Price: {this.props.buy.price}</p>
            <p>Available Quantity: {this.props.buy.quantity_left}</p>

            <div class="border col-sm">
                <br></br>
                <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Amount :</label>
                            <input type="text"
                                value={this.state.Value}
                                onChange={this.onChangeValue}
                            />
                        </div>         
                        <div className="form-group">
                            <input type="submit" value="Place Order" className="btn btn-primary" />
                        </div>
                    </form>
            </div>
            <br></br><br></br>
            </div>
            <br></br></div>
        )
    }
}
