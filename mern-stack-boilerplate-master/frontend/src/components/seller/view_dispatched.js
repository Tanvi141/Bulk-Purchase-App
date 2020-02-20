import React, {Component} from 'react';
import axios from 'axios';

export default class ViewDispatched extends Component {
    
    constructor(props) {
        super(props);
        this.state = {products: []}
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

    // edit = (data) => { 
    //     // console.log(data)
    //     axios.post('http://localhost:4000/seller/dispatch_product',data)
    //          .then(response => {
    //              console.log(response);
    //              alert(response.data.msg)
    //          })
    //          .catch(function(error) {    
    //             console.log(error);
    //          })
    //     // somehow reload the page to remove the entry
    // }


    render() {
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            {/* <th></th>
                            <th></th> */}
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
                                    {/* <td><button onClick={() => this.edit(currentProduct)}>Reviews</button></td> */}
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