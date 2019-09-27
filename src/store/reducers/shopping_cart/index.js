import { combineReducers } from 'redux';
import products from './products';

const ShoppingCart = combineReducers({
    products,
});

export default ShoppingCart;