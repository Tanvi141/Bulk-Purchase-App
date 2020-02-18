import React, {Component} from 'react';
import axios from 'axios';

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
        console.log("mounted");
        console.log(this.props.products)
    }

    edit = (data) => { 
        console.log(data)
    //     axios.post('http://localhost:4000/seller/delete_product',data)
    //          .then(response => {
    //              console.log(response);
    //              alert(response.data.msg)
    //          })
    //          .catch(function(error) {    
    //             console.log(error);
    //          })
    //     // somehow reload the page to remove the entry
    }


    render() {
        return (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Quantity Left</th>
                        <th>Seller</th>
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
                                <td>{currentProduct.seller_id}</td>
                                <td><button onClick={() => this.edit(currentProduct)}>Order</button></td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        )
    }
}
