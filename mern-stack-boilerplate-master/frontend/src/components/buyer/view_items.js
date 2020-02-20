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
            user_type:"Price"
        };

        this.onChangeName = this.onChangeName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleOptionChange = changeEvent => {
        this.setState({
          user_type: changeEvent.target.value });
      };

    onChangeName(event) {
        this.setState({ Name: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state.Name)

        const send={
            search: this.state.Name,
            filter: this.state.user_type
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
                    <h4>Search By:</h4>        
                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="Price"
                                checked={this.state.user_type === "Price"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                            Price
                        </label>
                     </div>
                     <div className="form-group">   
                        <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="Quantity Left"
                                checked={this.state.user_type === "Quantity Left"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                            Quantity Left
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="Rating"
                                checked={this.state.user_type === "Rating"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                            Rating
                        </label>
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
            showComponent2 : false,
            showComponent1 : false,
        };
    }

    edit = (data) => { 
        // console.log(data)
        this.setState({
            togo: data,
            showComponent: true
        });
    }

    func = (data) => { 
        // console.log(data)
        axios.post('http://localhost:4000/buyer/getreview',data)
             .then(response => {
                this.setState({
                    seller: data.seller_id,
                    buy: response.data.result,
                    avg: response.data.avg,
                    showComponent2: true
                });
            })
             .catch(function(error) {
                 console.log(error);
            })
        
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
                                <td><button onClick={() => this.func(currentProduct)}>Seller Reviews</button></td>
                                <td><button onClick={() => this.edit(currentProduct)}>Order</button></td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            {this.state.showComponent && <PlaceOrder buy={this.state.togo}/>}
            {this.state.showComponent2 && <SeeReviews buy={this.state.buy} seller={this.state.seller} avg={this.state.avg}/>}
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

class SeeReviews extends React.Component{
        
    constructor(props) {
        super(props);
        
    }
    

    render() {
        return (
            <div class="border col-sm">
                <br></br>
                <h3>Reviews for {this.props.seller}</h3>
                <h4>Average Rating: {this.props.avg}</h4>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Review By</th>
                        <th>Rating</th>
                        <th>Review</th>
                    </tr>
                </thead>
                <tbody>
                { 
                    this.props.buy.map((currentProduct, i) => {
                        return (
                            <tr>
                                <td>{currentProduct.product_name}</td>
                                <td>{currentProduct.buyer_id}</td>
                                <td>{currentProduct.rating}</td>
                                <td>{currentProduct.review}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            </div>
        )
    }
}