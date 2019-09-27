/* eslint-disable func-names */
import * as Actions from '../../actions';

const initialState = {
	data: {},
	isBuy: false,
	isLoading: false,
	error: false,
};

const singleProductReducer = function (state = initialState, action) {
	switch (action.type) {
		case Actions.GET_SINGLE_PRODUCT: {
			return {
				...state,
				isLoading: true,
				error: false,
			};
		}
		case Actions.GET_SINGLE_PRODUCT_SUCCESS: {
			return {
				...state,
				data: action.payload,
				isLoading: false,
				error: false,
			};
		}
		case Actions.GET_SINGLE_PRODUCT_ERROR: {
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};
		}
		case Actions.CHECK_CUSTOMER_BY_PRODUCT:
			return {
				...state,
				isBuy: action.payload > 0,
			};
		default: {
			return state;
		}
	}
};

export default singleProductReducer;
