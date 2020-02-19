import React, {Component} from 'react';
import axios from 'axios';

export default class ViewBookings extends Component {
    
    constructor(props) {
        super(props);
        this.state = {products: []}
    }

    componentDidMount(){
        const send={
            user: localStorage.getItem("user")
        }

        axios.post('http://localhost:4000/buyer/view',send)
            .then(response => {
                this.setState({products: response.data});
                console.log("products")
                console.log(response)
            })
            .catch(function(error) {
                console.log(error);
            })
    }

    edit = (data) => { 
        console.log(data)
        axios.post('http://localhost:4000/buyer/volstatus',data)
             .then(response => {
                this.setState({
                    buy: response.data[0],
                    showComponent: true
                });
             })
             .catch(function(error) {    
                console.log(error);
             })
        // somehow reload the page to remove the entry
    }

    render() {
        return (
            <div>
                <h1>Placed Orders</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Seller</th>
                            <th>Price</th>
                            <th>Quantity Total</th>
                            <th>Quantity Ordered</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.products.map((currentProduct, i) => {
                            return (
                                <tr>
                                    <td>{currentProduct.name}</td>
                                    <td>{currentProduct.seller_id}</td>
                                    <td>{currentProduct.price}</td>
                                    <td>{currentProduct.quantity_total}</td>
                                    <td>{currentProduct.quantity}</td>
                                    {/* <td>{currentProduct.status}</td> */}
                                    <td><button onClick={() => this.edit(currentProduct)}>View Status</button></td>
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
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {cancelled: "temp"};
        const send={
            item: this.props.buy,
            user: localStorage.getItem("user")
        }

        axios.post('http://localhost:4000/buyer/getitnow',send)
             .then(response => {
                this.setState({cancelled: response.data[0].status_by_buyer});
                console.log(response.data[0])
             })
             .catch(function(error) {
                 console.log(error);
        })
    }

    onSubmit(e) {
        e.preventDefault();
        // console.log("buy");
        // console.log(this.props.buy);

        // const send={
        //     item: this.props.buy,
        //     user: localStorage.getItem("user")
        // }
        
        // // axios.post('http://localhost:4000/buyer/cancel',send)
        // //      .then(response => {
        // //          alert(response.data.msg)
        // //         //  console.log(response)
        // //      })
        // //      .catch(function(error) {
        // //          console.log(error);
        // // })

        // axios.post('http://localhost:4000/buyer/getitnow',send)
        //      .then(response => {
        //          this.setState({cancelled: response.data[0].status_by_buyer});
        //          console.log(response.data[0])
        //      })
        //      .catch(function(error) {
        //          console.log(error);
        // })

    }

    render() {
        return (
            <div>
            <div class="border col-sm">
            <br></br><br></br>
            <p>Product Name: {this.props.buy.name}</p>
            <p>Seller: {this.props.buy.seller_id}</p>
            <p>Status: {this.props.buy.status}</p>
            <p>Quantity Left: {this.props.buy.quantity_left}</p>
            {/* <p>Status by Buyer: {this.state.cancelled}</p> */}
            
                {/* <form onSubmit={this.onSubmit}>        
                        <div className="form-group">
                            <input type="submit" value="Cancel" className="btn btn-primary" />
                        </div>
                </form> */}
            <br></br><br></br>
            </div>
            <br></br></div>
        )
    }
}