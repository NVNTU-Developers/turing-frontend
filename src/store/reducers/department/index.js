import { combineReducers } from 'redux';
import all from './all';

const department = combineReducers({
    all,
});

export default department;