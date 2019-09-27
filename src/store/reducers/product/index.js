import { combineReducers } from 'redux';
import item from './single_product.reducer';
import locations from './product_locations.reducer';

const product = combineReducers({
    item,
    locations,
});

export default product;
