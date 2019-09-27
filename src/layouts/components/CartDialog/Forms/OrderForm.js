import React, {Component} from 'react';
import {Button, withStyles, MenuItem} from '@material-ui/core';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {SelectFormsy, TextFieldFormsy} from '../../../../components/Formsy';
import Formsy from 'formsy-react';
import styles from './styles';
import ConfigSystem from '../../../../config/system';
import { createOrder, paymentWithStripe, emptyCart } from '../../../../store/actions/shopping_cart.actions';
import CartStorage from '../../../../utils/CartStorage';

class OrderForm extends Component {

    state = {
        canSubmit: false,
    }

    enableButton() {
        this.setState({ canSubmit: true });
    }

    disableButton() {
        this.setState({ canSubmit: false });
    }

    form = React.createRef();

    makePayment = (token) => {
        this.props.createOrder({ cart_id: CartStorage.cart_id }, (order_id) => {
            this.props.paymentWithStripe({ email: token.email, stripeToken: token.id, order_id }, () => {
                this.props.emptyCart(() => {
                    this.props.handleClose();
                });
            });
        });
    }

    render() {
        return (
            <div id="delivery" className="w-full flex flex-row justify-center">
                    <div className="w-full">
                        <Formsy
                            onValid={() => this.enableButton()}
                            onInvalid={() => this.disableButton()}
                            ref={(form) => this.form = form}
                            className="bg-white shadow-md rounded px-4 pt-4 mt-4 pb-6 mb-2"
                        >
                            <div className="flex flex-row justify-between">
                                <TextFieldFormsy
                                    className="w-5/12 mb-4"
                                    type="text"
                                    rows={4}
                                    name="first-name"
                                    label="First Name"
                                    variant="outlined"
                                />
                                <TextFieldFormsy
                                    className="w-5/12 mb-4"
                                    type="text"
                                    rows={4}
                                    name="last-name"
                                    label="Last Name"
                                    variant="outlined"
                                />
                            </div>
                            <div className="flex flex-row justify-between">
                                <TextFieldFormsy
                                    className="w-5/12 mb-4"
                                    type="text"
                                    rows={4}
                                    name="address"
                                    label="Address"
                                    variant="outlined"
                                />
                                <TextFieldFormsy
                                    className="w-5/12 mb-4"
                                    type="text"
                                    rows={4}
                                    name="city"
                                    label="City"
                                    variant="outlined"
                                />
                            </div>
                            <div className="flex flex-row justify-between">
                                <TextFieldFormsy
                                    className="w-5/12  mb-4"
                                    type="text"
                                    rows={4}
                                    name="state"
                                    label="State"
                                    variant="outlined"
                                />
                                <TextFieldFormsy
                                    className="w-5/12  mb-4"
                                    type="text"
                                    rows={4}
                                    name="country"
                                    label="Country"
                                    variant="outlined"
                                />
                            </div>
                            <div className="flex flex-row justify-between">
                                <TextFieldFormsy
                                    className="w-5/12 mb-2"
                                    type="text"
                                    rows={4}
                                    name="zip"
                                    label="Zip Code"
                                    variant="outlined"
                                />

                                <SelectFormsy
                                    name="shipping_id"
                                    className="w-5/12 mb-2"
                                    label="Shipping Region"
                                    id="region"
                                    value={1}
                                >
                                    <MenuItem value="Select shipping region" className="region-option">Select shipping region</MenuItem>
                                </SelectFormsy>
                            </div>
                            <SelectFormsy
                                    name="shipping_id"
                                    className="w-5/12 mb-1 flex justify-center"
                                    label="Shipping Type"
                                    id="type"
                                    value={1}
                                >
                                    <MenuItem value="Select shipping type" className="type-option">Select shipping Type</MenuItem>
                                </SelectFormsy>
                            <StripeCheckout
                                name="Tshirt Shop"
                                description="Payment description"
                                amount={this.props.totalPrice * 100}
                                token={token => this.makePayment(token)}
                                stripeKey={ConfigSystem.stripeToken}
                                disabled={!this.state.canSubmit}
                                id="stripe-popup"
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={!this.state.canSubmit}
                                    className="w-6/12 mx-auto mt-4 normal-case flex justify-center"
                                    aria-label="Make Payment"
                                    id="make-payment"
                                    value="legacy"
                                >
                                    Make Payment
                                </Button>
                            </StripeCheckout>

                        </Formsy>
                    </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createOrder,
        paymentWithStripe,
        emptyCart,
    }, dispatch);
}

function mapStateToProps({ }) {
    return {}
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(OrderForm));

