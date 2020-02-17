import React, {Component} from 'react';
import axios from 'axios';

export default class ViewAdded extends Component {
    
    constructor(props) {
        super(props);
        this.state = {products: []}
    }

    componentDidMount(){
        const send={
            user=localStorage.getItem("user")
        }

        axios.post('http://localhost:4000/seller/view',send)
             .then(response => {
                 this.setState({products: response.data});
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
                            <th>Quantity Left</th>
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
                                    <td>{currentProduct.quantity_left}</td>
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