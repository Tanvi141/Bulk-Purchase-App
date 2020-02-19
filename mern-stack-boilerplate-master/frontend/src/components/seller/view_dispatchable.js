import React, {Component} from 'react';
import axios from 'axios';

export default class ViewDispatchable extends Component {
    
    constructor(props) {
        super(props);
        this.state = {products: []}
    }

    componentDidMount(){
        const send={
            user: localStorage.getItem("user")
        }
        send.type="Posted";
    
        axios.post('http://localhost:4000/seller/view',send)
             .then(response => {
                 this.setState({products: response.data});
                 console.log(response)
             })
             .catch(function(error) {
                 console.log(error);
             })
    }

    edit = (data) => { 
        // console.log(data)
        axios.post('http://localhost:4000/seller/dispatch_product',data)
             .then(response => {
                 console.log(response);
                 alert(response.data.msg)
             })
             .catch(function(error) {    
                console.log(error);
             })
        // somehow reload the page to remove the entry
    }

    delete = (data) => { 
        // console.log(data)
        axios.post('http://localhost:4000/seller/delete_product',data)
             .then(response => {
                 console.log(response);
                 alert(response.data.msg)
             })
             .catch(function(error) {    
                console.log(error);
             })
        // somehow reload the page to remove the entry
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
                            <th></th>
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
                                    {/* <td>{currentProduct.quantity_left}</td> */}
                                    <td><button onClick={() => this.delete(currentProduct)}>Delete</button></td>
                                    <td><button onClick={() => this.edit(currentProduct)}>Dispatch</button></td>
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