import React, {Component} from 'react';
import axios from 'axios';

export default class ViewDispatched extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            showComponent2: false,
            ptosend:""    
        }
    }

    componentDidMount(){
        const send={
            user: localStorage.getItem("user")
        }
        send.type="Dispatched";
    
        axios.post('http://localhost:4000/seller/view',send)
             .then(response => {
                 this.setState({products: response.data});
                 console.log(response)
             })
             .catch(function(error) {
                 console.log(error);
             })
    }

    func = (data) => { 
        // console.log(data)
        axios.post('http://localhost:4000/buyer/viewallreviews',data)
             .then(response => {
                this.setState({
                    buy: response.data,
                    ptosend: data.name,
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
                            <th>Quantity</th>
                            <th></th>
                            {/* <th></th> */}
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.products.map((currentProduct, i) => {
                            return (
                                <tr>
                                    <td>{currentProduct.name}</td>
                                    <td>{currentProduct.price}</td>
                                    <td>{currentProduct.quantity}</td>
                                    {/* <td><button onClick={() => this.delete(currentProduct)}>Delete</button></td> */}
                                    <td><button onClick={() => this.func(currentProduct)}>Reviews</button></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                <br></br>
            {this.state.showComponent2 && <SeeReviews buy={this.state.buy} ptosend={this.state.ptosend}/>}
            </div>
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
                <h3>Reviews for {this.props.ptosend}</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Review By</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th></th>
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