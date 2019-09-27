/* eslint-disable func-names */
import * as Actions from '../../actions';

const initialState = {
	data: {
		rows: [],
		paginationMeta: {},
	},
	colors: [],
	sizes: [],
	isLoading: false,
	error: false,
	filter: {},
};

const allProductsReducer = function (state = initialState, action) {
	switch (action.type) {
		case Actions.GET_ALL_PRODUCTS_SUCCESS:
		{
			return {
				...state,
				data: action.payload,
				isLoading: false,
				error: false,
			};
		}
		case Actions.GET_ALL_PRODUCTS_ERROR:
		{
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};
		}
		case Actions.GET_ALL_PRODUCTS_START:
		{
			return {
				...state,
				isLoading: true,
				error: false,
				filter: action.payload,
			};
		}
		case Actions.GET_COLOR_SIZE_SUCCESS:
		{
			return {
				...state,
				colors: action.payload.colors,
				sizes: action.payload.sizes,
			};
		}
		default:
		{
			return state;
		}
	}
};

export default allProductsReducer;
