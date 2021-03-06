import React, { Component } from 'react';
import {Button, Form, Col} from "react-bootstrap";
import OrderActions from "../actions/OrderActions";
import OrderStore from "../store/OrderStore";


export class AddOrder extends Component {
    state = {
            shutterTypes: [],
            showFinalizeForm : false,
            activeUser: "",
            addedOrderCounter: 0,
            contactEmail:"",
            address:"",
            currentOrder: {
                    shutterType: "Plastic",
                    windowHeight: "",
                    windowWidth:"",
                    windowType:"Simple",
                    orderedPieces:"",
                    isJobFinished:"false"
                },
            order: []
            };


    handleSubmit = (e) => {
        e.preventDefault();
        if (OrderStore.activeUserId === null || OrderStore.activeUserId ==="" || OrderStore.activeUserId  === undefined){alert("Please log in first! Type a username in the header and press login"); return;}
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        e.persist();
        this.setState({order: [...this.state.order, this.state.currentOrder]});
        this.setState(({addedOrderCounter : this.state.addedOrderCounter +1}));
        alert('Added your order to shopping cart');
        document.getElementById("orderForm").reset();
    };

    onChange = (e) => {
        e.persist();
        this.setState(prevState => ({currentOrder: {...prevState.currentOrder, [e.target.name]: e.target.value}}));
    };

    onNumericInputChange = (e) => {
        e.persist();
        if (e.target.value<1) {alert ("NOPE."); e.target.value=1;}
        this.setState(prevState => ({currentOrder: {...prevState.currentOrder, [e.target.name]: e.target.value}}));
    };

    onFinalizeFormChange = (e) => {
        e.persist();
        this.setState({[e.target.name]: e.target.value});
    };

    onFinalOrderSubmitted = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (OrderStore.activeUserId === null || OrderStore.activeUserId ==="" || OrderStore.activeUserId  === undefined){alert("Please log in first! Type a username in the header and press login"); return;}
        if (this.state.addedOrderCounter === 0) {alert('Please add at least 1 item to shopping cart before submitting'); return;}
        let orderData = { order : {
                customerId:  OrderStore.activeUserId,
                contactEmail: this.state.contactEmail,
                address:this.state.address,
                order: this.state.order,
                isPaid: "false",
                installDate:"not organized"
            }};
        OrderActions.addOrder(orderData);
    };

    switchModeToFinalize= (e) => {
        e.preventDefault();
        if (this.state.addedOrderCounter === 0) {alert('Please add at least 1 item to shopping cart before submitting'); return;}
        this.setState({showFinalizeForm: true});
    };

    componentDidMount() {
        fetch('/getShutterTypes',{headers : {
                "Content-Type" : "application/json", "Accept" : "application/json"
            }}).then(response =>{ return response.json()})
            .then(result =>{this.setState({shutterTypes:result});});
    }

    render() {
        if (!this.state.shutterTypes.material || !this.state.shutterTypes.type) {
            return <div />
        }
        return ( <div>

               <Form  id = "orderForm" onSubmit={e => this.handleSubmit(e)} style={this.state.showFinalizeForm ? {display: 'none'} : {  }}>
                <Form.Row>
                    <Form.Group as={Col} controlId="windowType">
                        <Form.Label>Select window type:</Form.Label>
                        <Form.Control required name="windowType" as="select" onChange={this.onChange}>
                            {this.state.shutterTypes.type.map((type) => (
                                <option>{type}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}/>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="windowWidth">
                        <Form.Label>Define window width (mm):</Form.Label>
                        <Form.Control required name="windowWidth" type="number" onChange={this.onNumericInputChange}/>
                    </Form.Group>
                    <Form.Group as={Col} controlId="windowHeight">
                        <Form.Label>Define window height (mm):</Form.Label>
                        <Form.Control required name="windowHeight" type="number" onChange={this.onNumericInputChange}/>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="shutterType">
                        <Form.Label>Select shutter type:</Form.Label>
                        <Form.Control required name="shutterType" as="select" onChange={this.onChange}>
                            {this.state.shutterTypes.material.map((mat) => (
                                <option>{mat}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}/>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="orderedPieces">
                        <Form.Label>How many pieces would you like to order?</Form.Label>
                        <Form.Control required name="orderedPieces" type="number" onChange={this.onNumericInputChange}/>
                    </Form.Group>
                    <Form.Group as={Col}/>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="btn">
                        <Button variant="outline-success" type="submit">Add to shopping cart</Button>
                    </Form.Group>
                    <Form.Group as={Col} controlId="btn">
                        <Button variant="primary" onClick={this.switchModeToFinalize}>Finalize order</Button>
                    </Form.Group>
                </Form.Row>

            </Form>
            <Form onSubmit={e => this.onFinalOrderSubmitted(e)} style={this.state.showFinalizeForm ? {} : { display: 'none' }}>
                <Form.Row>
                    <Form.Group controlId="contactEmail">
                        <Form.Label>Contact e-mail:</Form.Label>
                        <Form.Control required name="contactEmail" type="email" onChange={this.onFinalizeFormChange}/>
                    </Form.Group>
                    <Form.Group controlId="address">
                        <Form.Label>Delivery address:</Form.Label>
                        <Form.Control required name="address" onChange={this.onFinalizeFormChange}/>
                    </Form.Group>
                </Form.Row>
                <Form.Group as={Col} controlId="btn">
                    <Button variant="primary" type="submit">Finalize order</Button>
                </Form.Group>
                <Form.Row>
                </Form.Row>
            </Form>
            </div>
        )
    }
}

export default AddOrder