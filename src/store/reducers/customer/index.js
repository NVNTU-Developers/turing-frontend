import { combineReducers } from 'redux';
import profile from './profile';

const customer = combineReducers({
    profile,
});

export default customer;