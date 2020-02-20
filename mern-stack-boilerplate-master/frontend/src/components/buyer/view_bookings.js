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

        // axios.post('http://localhost:4000/buyer/getitnow',send)
        //      .then(response => {
        //         this.setState({cancelled: response.data[0].status_by_buyer});
        //         // console.log(response.data[0])
        //      })
        //      .catch(function(error) {
        //          console.log(error);
        // })
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.props.buy.status)
        if(this.props.buy.status==="Dispatched"){
            this.setState({
                showComponent: true
            });
        }   
        else{
            alert("Cannot write a review unless product is dispatched")
        }
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
            
                <form onSubmit={this.onSubmit}>        
                        <div className="form-group">
                            <input type="submit" value="Review" className="btn btn-primary" />
                        </div>
                </form>
            <br></br><br></br>
            {this.state.showComponent && <WriteReview buy={this.props.buy}/>}<br></br>
            </div>
            <br></br></div>
        )
    }
}

class WriteReview extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            user_type: ''  
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleOptionChange = changeEvent => {
        this.setState({
          user_type: changeEvent.target.value });
      };


    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const send = {
            item: this.props.buy,
            rating: this.state.user_type,
            review: this.state.username,
            user: localStorage.getItem("user")
        }
        
        console.log(send)
        axios.post('http://localhost:4000/addreview', send)
            .then(res =>{ 
                // console.log(res.data.msg);
                alert(res.data.msg)
            });

        this.setState({
            username: '',
            user_type: ''
        });
    }

    render() {
        return (
            
            <div class="border col-sm">
                <br></br>
                <h3>Write a Review!!</h3>
                <br></br>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Review</label>
                        <input type="text"
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    
                    <div class="style=padding:100px;">
                        Rating:<br></br>
                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="1"
                                checked={this.state.user_type === "1"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                            ⭐
                        </label>
                     </div>
                     <div className="form-group">   
                        <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="2"
                                checked={this.state.user_type === "2"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                            ⭐⭐
                        </label>
                    </div>
                    <div className="form-group">   
                        <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="3"
                                checked={this.state.user_type === "3"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                            ⭐⭐⭐
                        </label>
                    </div><div className="form-group">   
                        <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="4"
                                checked={this.state.user_type === "4"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                            ⭐⭐⭐⭐
                        </label>
                    </div><div className="form-group">   
                        <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="5"
                                checked={this.state.user_type === "5"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                            />
                            ⭐⭐⭐⭐⭐
                        </label>
                    </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Submit" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}