import {combineReducers} from 'redux';
import alerts from './alerts';
import products from './products';
import product from './product';
import customer from './customer';
import ShoppingCart from './shopping_cart';
import department from './department';
import review from './review';

const createReducer = (asyncReducers) =>
    combineReducers({
        alerts,
        products,
        product,
        customer,
        department,
        ShoppingCart,
        review,
        ...asyncReducers
    });

export default createReducer;
