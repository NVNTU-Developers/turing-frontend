/**
 * Implement functionality for Cart
 */
import { withStyles} from '@material-ui/core';
import React, {Component} from 'react';
import systemConfig from "../../../../config/system";
import InputNumber from '../../../../components/InputNumber';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateCartItemQuantity, removeItemFromShoppingCart, getCartProducts } from '../../../../store/actions/shopping_cart.actions';

import styles from './styles';

class Cart extends Component {

    handleChangeQuantity = (quantity, item_id) => {
        this.props.updateCartItemQuantity({ quantity, item_id });
    }

    handleRemoveItem = (item_id, cart_id) => {
        this.props.removeItemFromShoppingCart({ item_id }, () => {
            this.props.getCartProducts(cart_id);
        });
    }

    render() {
        const { classes, items = [] } = this.props;

        return (
            <div id="cart">
                <div className={`flex mb-4 h-8 ${classes.headerBorderBottom}`}>
                    <div className="w-3/6">
                        <span className={classes.headerTitle}>Item</span>
                    </div>
                    <div className="w-1/12">
                        <span className={classes.headerTitle}>Color</span>
                    </div>
                    <div className="w-1/12">
                        <span className={classes.headerTitle}>Size</span>
                    </div>
                    <div className="w-3/12">
                        <span className={classes.headerTitle}>Quantity</span>
                    </div>
                    <div className="w-2/12">
                        <span className={classes.headerTitle}>Price</span>
                    </div>
                </div>
                <div className={classes.cartContent}>
                    {
                        items.map((el) => {
                            return (
                                <div key={el.item_id} className="flex mb-4">
                                    <div className="w-2/12">
                                        <img className="w-full" src={systemConfig.imageBaseUrl + el.image}
                                                alt="Product"/>
                                    </div>
                                    <div className="w-4/12 pl-6 cart-item">
                                        <div className="w-full">
                                            <span className={`cart-item-title ${classes.nameText}`}>{el.name}</span>
                                        </div>
                                        {/* <div className="w-full pt-2">
                                            <span className={classes.productCodeText}>Men BK35679</span>
                                        </div> */}
                                        <div className="w-full pt-2 cart-item-remove" style={{cursor: "pointer"}} onClick={() => this.handleRemoveItem(el.item_id, el.cart_id)}>
                                            <span><span className={classes.removeIcon}>X</span><span className={classes.removeText}> Remove</span></span>
                                        </div>
                                    </div>
                                    <div className="w-1/12 ">
                                        <span className={`cart-item-color ${classes.sizeText}`}>{el.attributes.split('-')[0]}</span>
                                    </div>
                                    <div className="w-1/12 ">
                                        <span className={`cart-item-size ${classes.sizeText}`}>{el.attributes.split('-')[1]}</span>
                                    </div>
                                    <div className="w-3/12 h-8">
                                        <InputNumber
                                            value={el.quantity}
                                            onChange={(val) => this.handleChangeQuantity(val, el.item_id)}
                                        />
                                    </div>
                                    <div className="w-2/12">
                                        <span className={`cart-item-price ${classes.priceText}`}>£ <span>{parseFloat(el.discounted_price) > 0 ? el.discounted_price : el.price}</span></span>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateCartItemQuantity,
        removeItemFromShoppingCart,
        getCartProducts,
    }, dispatch);
}

function mapStateToProps({}) {
    return {}
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Cart));
